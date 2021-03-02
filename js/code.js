let todo_list = [];
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function todo(name, description, due_date){
	this.name = name;
	this.description = description;
	this.due_date = due_date;
	this.creation_date = new Date();
	this.complete = false;
}
let todo_checking_interval = null;


const list_length_heading = document.querySelector('#list-length');
const todo_list_el = document.querySelector('#to-do-list');


let current_modal_index;
/* These are the elements concerned with the modal box */
const modal_box = document.querySelector('#modal-box');
const modal_close = document.querySelector('#modal-close');
modal_close.addEventListener('click', () => {modal_box.style.display = 'none';});
const modal_previous = document.querySelector('#modal-previous');
modal_previous.addEventListener('click', () => change_modal_todo('previous'));
const modal_next = document.querySelector('#modal-next');
modal_next.addEventListener('click', () => change_modal_todo('next'));
const modal_name = document.querySelector('#modal-name');
const modal_description = document.querySelector('#modal-description');
const modal_complete = document.querySelector('#modal-complete');
const modal_creation_date = document.querySelector('#modal-creation-date');
const modal_due_date = document.querySelector('#modal-due-date');



/* This are all the elements concerned with the to-do creation section */

//The section that contains all elements except name input and add button. Its display = none initially
const extra_input = document.querySelector('#extra-input');

//This is an angle at the bottom right corner that shows or hides the extra input section
const expand_input = document.querySelector('#expand-input');
expand_input.addEventListener('click', expand_extra_input);

// The name input. Can't be empty to create a new to-do
const name_input = document.querySelector('#name-input');
name_input.addEventListener('keyup', ev => {if(ev.keyCode === 13) on_add();});
const wrong_name_input = document.querySelector('#wrong-name-input'); //Displays feedback on the name input

const description_input = document.querySelector('#description-input');
const time_input = document.querySelector('#time-input');
const date_input = document.querySelector('#date-input');
const wrong_date_input = document.querySelector('#wrong-date-input');//Displays feedback on the time/date input
const add_button = document.querySelector('#add-button');
add_button.addEventListener('click', on_add);



//This next element is the select element, when any category is chosen, the lists is sorted accordingly
const select = document.querySelector('#sort-select');
select.addEventListener('change', rearrange_list);



function change_modal_todo(direction){
	if(direction === 'previous'){
		if(current_modal_index - 1 < 0){
			current_modal_index = todo_list.length - 1;
		}
		else{
			current_modal_index--;
		}
	}
	else{
		if(current_modal_index + 1 === todo_list.length){
			current_modal_index = 0;
		}
		else{
			current_modal_index++;
		}
	}
	display_modal_box(current_modal_index);
}


function check_for_due_dates(){
	let now = new Date().getTime();
	for(let td of todo_list){
		if(!td.complete && td.due_date !== undefined && td.due_date.getTime() < now && !('late' in td)){
			//console.log(td.name);
			//console.log(`Now ${now}`);
			//console.log(`td.due_date ${td.due_date.getTime()}`);
			//console.log(now > td.due_date.getTime());
			td.late = true;
			mark_element(todo_list.indexOf(td), 'late');
		}
	}
	if(!todo_list.some(td => td.due_date !== undefined && td.due_date.getTime() > now)){
		clearInterval(todo_checking_interval);
		todo_checking_interval = null;
	}
}


function clear_inputs(){
	//Restores empty values for inputs and hides wrong-input messages

	name_input.value = '';
	wrong_name_input.style.visibility = 'hidden';
	description_input.value = '';
	time_input.value = '';
	date_input.value = '';
	wrong_date_input.style.visibility = 'hidden';
}


function create_todo_element(name, id){
	/* Creates the li element with its necessary internal structures */

	let li = document.createElement('li');
	li.id = `todo-${id}`;

	let check = document.createElement('span');
	check.className = 'check-span';
	check.innerHTML = '&check;';
	check.addEventListener('click', ev => on_check(ev.target));
	li.appendChild(check);

	let wrapper = document.createElement('div');
	wrapper.className = `to-do-element`;
	wrapper.addEventListener('click', (ev) => {highlight_todo(ev.target);});

	let todo = document.createElement('span');
	todo.className = 'to-do-text';
	todo.textContent = name;
	wrapper.appendChild(todo);
	li.appendChild(wrapper);

	let close = document.createElement('span');
	close.className = 'close-span';
	close.innerHTML = '&times;';
	close.addEventListener('click', ev => on_delete(ev.target));
	li.appendChild(close);

	return li;
}


function display_modal_box(index){
	let td = todo_list[index];

	modal_name.textContent = td.name;

	if(td.description !== '') modal_description.textContent = td.description;
	else modal_description.textContent = 'No description';
	
	let complete = td.complete === true ? 'Yes' : 'No';
	modal_complete.textContent = complete;

	let creation = td.creation_date;
	if(creation !== undefined){
		creation = `${format_date(creation)} <span class="date-hint">${find_time_between_dates(new Date(), td.creation_date)} have passed</span>`;
	}
	else{
		creation = 'Creation date undefined';
	}
	modal_creation_date.innerHTML = creation;

	let due = td.due_date;
	if(due !== undefined){
		due = `${format_date(due)} <span class="date-hint">${find_time_between_dates(td.due_date, new Date())} left</span>`;
	}
	else{
		due = 'Due date undefined';
	}
	modal_due_date.innerHTML = due;

	modal_box.style.display = 'block';
}


function display_wrong_input(element, message){
	element.textContent = message;
	element.style.visibility = "visible";
}


function erase_todo_list_element(){
	while(todo_list_el.firstElementChild){
		todo_list_el.removeChild(todo_list_el.firstElementChild);
	}
}


function expand_extra_input(){
	if(expand_input.innerHTML === '⊻'){
		//extra_input.style.display = 'block';
		extra_input.style.height = 'fit-content';
		expand_input.innerHTML = '&#8892;';
	}
	else{
		//extra_input.style.display = 'none';
		extra_input.style.height = '0';
		expand_input.innerHTML = '&#8891;';
	}
}


function fill_todo_list_element(){
	for(let i = 0; i < todo_list.length; i++){
		td = todo_list[i];
		todo_list_el.appendChild(create_todo_element(td.name, i));
		if(td.complete) mark_element(i, 'complete');
		else if('late' in td) mark_element(i, 'late');
	}
}


function find_time_between_dates(new_date, old_date){
	let difference = new_date.getTime() - old_date.getTime();
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	if(difference > 3600000){
		hours = Math.floor(difference / 3600000);
		difference = difference % 3600000;
	}
	if(difference > 60000){
		minutes = Math.floor(difference / 60000);
		difference = difference % 60000;
	}
	if(difference > 1000){
		seconds = Math.floor(difference / 1000);
	}

	return `${hours} hours ${minutes} minutes ${seconds} seconds`;
}


function format_date(date){
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hour = date.getHours();
	let minute = String(date.getMinutes());
	if(minute.length === 1) minute = minute.padStart(2, '0');
	return `${months[month]} ${day}, ${year} at ${hour}:${minute}`;
}


function gather_todo_input(){
	/* Gets data from all inputs and returns it. */
	let name = name_input.value.trim();
	let description = description_input.value.trim();
	let time = time_input.value;
	let date = date_input.value;

	/* The date input receives the corresponding number for each month, however to create the date object
	the months are zero-based. So February would be returned as the 2 month, and to create the object
	we need to substract 1 from the month, so we would pass 1 to the constructor */

	let due_date;
	if(time !== '' && date !== '') 
		due_date = new Date(date.slice(0, 4), Number(date.slice(5, 7)) - 1, date.slice(8, 10), time.slice(0, 2), time.slice(3, 5));

	return [name, description, due_date];
}


function highlight_todo(element){
	let parent = element.className === 'to-do-text' ? element.parentElement.parentElement : element.parentElement;
	current_modal_index = Number(parent.id.slice(5));
	display_modal_box(current_modal_index);
}


function mark_element(index, mark_type){
	let el = todo_list_el.children[index];
	el.className = `${mark_type}-to-do`;
	el.children[1].className = `to-do-element ${mark_type}-to-do-element`;
}


function on_add(){
	let [name, description, due_date] = gather_todo_input(); //Get info from inputs
	let correct_input = true;

	//Checking if all input was valid
	if(name === ''){
		display_wrong_input(wrong_name_input, "Name can't be empty");
		correct_input = false;
	}
	if(todo_list.map(td => td.name).includes(name)){
		display_wrong_input(wrong_name_input, "That to-do already exists");
		correct_input = false;
	}
	if(due_date !== undefined){
		if(due_date < new Date()){
			display_wrong_input(wrong_date_input, "The specified date must be in a future date");
			correct_input = false;
		}
	}
	
	if(correct_input){
		let td = new todo(name, description, due_date); //Create to-do object
		todo_list.push(td); //Add object to the list

		let el = create_todo_element(name, todo_list.length - 1); //Create actual element
		todo_list_el.appendChild(el); //Append element to the list element

		update_list_length_heading();
		clear_inputs();
		if(todo_checking_interval === null  && due_date !== undefined){
			todo_checking_interval = setInterval(check_for_due_dates, 30000);
		}
	}
}


function on_check(check_el){
	let index = check_el.parentElement.id.slice(5); //Access parent element, then get index from the end of parent's id
	todo_list[index].complete = true;
	check_el.style.color = 'green';
	mark_element(index, 'complete');
	update_list_length_heading();
}


function on_delete(close_el){
	let index = close_el.parentElement.id.slice(5);
	todo_list.splice(index, 1);
	todo_list_el.removeChild(close_el.parentElement);
	for(let i = 0; i < todo_list.length; i++){
		todo_list_el.children[i].id = `todo-${i}`;
	}
	update_list_length_heading();
	/*
	if(!todo_list.some(td => td.due_date !== undefined)){
		clearInterval(todo_checking_interval);
		todo_checking_interval = null;
		console.log('Stopped checking')
	}
	*/
}


function rearrange_list(){
	let [prop, direction] = select.value.split('-');
	
	//Property for the sorting is name, and will be converted to lowercase for the sorting
	if(prop === 'name'){
		todo_list.sort((a, b) => {
			return sort_todo_list(a[prop].toLowerCase(),  b[prop].toLowerCase(), direction);
		});
	}
	//Property is due_date (a date object), so the actual value must be checked cause it may be undefined
	else if(prop === 'due_date'){
		todo_list.sort((a, b) => {
			if(a[prop] === undefined && b[prop] === undefined) return 0;
			else if(a[prop] === undefined) return 1;
			else if(b[prop] === undefined) return -1;
			else return sort_todo_list(a[prop].getTime(), b[prop].getTime(), direction)
		});
	}
	//Property is creation_date (a date object)
	else{
		todo_list.sort((a, b) => {
			return sort_todo_list(a[prop].getTime(), b[prop].getTime(), direction);
		});
	}
	erase_todo_list_element();
	fill_todo_list_element();
}


function sort_todo_list(a, b, direction){
	if(direction === 'ascending' || direction === 'oldest' || direction === 'first'){
		if(a < b) return -1;
		else if(a > b) return 1;
		else return 0;
	}
	else if(direction === 'descending' || direction === 'newest' || direction === 'last'){
		if(a > b) return -1;
		else if(a < b) return 1;
		else return 0;
	}
}

function update_list_length_heading(){
	let undone_todos = todo_list.reduce((current, td) => current += td.complete === false ? 1 : 0, 0);
	if(undone_todos > 1){
		list_length_heading.textContent = `You have ${undone_todos} to-dos`;
	}
	else if(undone_todos === 1){
		list_length_heading.textContent = `You have 1 to-do`;
	}
	else{
		list_length_heading.textContent = 'You are to-do free';
	}
}

/*
let times = 1;
function fill_todo_list(){
	todo_list.push(new todo('Some'))
	todo_list.push(new todo('1 marzo', undefined, new Date(2021, 2, 1, 1, 1)))
	todo_list.push(new todo('shit'))
	todo_list.push(new todo('10 abril', undefined, new Date(2021, 3, 10, 1, 1)))
	todo_list.push(new todo('more'))
	todo_list.push(new todo('27 febrero', undefined, new Date(2021, 1, 27, 1, 1)))
}
fill_todo_list()
fill_todo_list_element()*/