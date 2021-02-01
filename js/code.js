function task(name, description){
	this.name = name;
	this.description = description;
	this.state = "undone";
	this.added_date = new Date();
}

const elements_list = [];

const no_task_info = document.querySelector("#no-task-info");
const task_list = document.querySelector("#task-list");
const name_input = document.querySelector("#name-input");
const description_input = document.querySelector("#description-input");
name_input.addEventListener("keyup", (ev) => {
	if(ev.keyCode === 13){
		if(name_input.value === ""){
			alert("You can't create a task without a name.")
		}
		else{
			if(modify_list === true){
				createTask();
			}
		}
	}
});
const submit_button = document.querySelector('#submit-button');
submit_button.addEventListener("click", () => {
	if(name_input.value === ""){
		alert("You can't create a task without a name.")
	}
	else{
		if(modify_list === true){
			createTask();
		}
	}
});

//This variable will be checked before creating or deleting an element so that processes don't overlap
let modify_list = true;



function checkListVisibility(){
	//If there are no tasks, display the no-task tag
	if(elements_list.length === 0){
		no_task_info.style.display = "block";
		task_list.style.display = "none";
	}
	//If there is at least one tag, display the list
	else if(elements_list.length > 0){
		no_task_info.style.display = "none";
		task_list.style.display = "block";
	}
	else{
		console.log("What the hell happened?");
	}
}



/* Adds the text to the list, and creates a new list item,
is puts the text span and the button span inside it,
append the item to the actual list. */
function createTask(){

	modify_list = false;

	n = name_input.value;
	d = description_input.value;
	elements_list.push(new task(n, d));

	let new_li = document.createElement("li");
	new_li.id = elements_list.length - 1;
	new_li.className = "list-item";

	let check_span = document.createElement("span");
	check_span.className = "check-button";
	check_span.innerHTML = "&check;";
	check_span.addEventListener("click", ev => {
		let index = ev.target.parentElement.id;
		let t = elements_list[index];
		if(t.state === "undone"){
			ev.target.style.color = "#0f0";
			t.state = "done";
		}
	});
	new_li.appendChild(check_span);

	let wrapper = document.createElement("div");
	wrapper.className = "text-span-wrapper";
	wrapper.addEventListener("click", ev => {
		displayModalBox(Number(ev.target.parentElement.id));
	});

	let text_span = document.createElement("span");
	text_span.className = "text-span";
	text_span.textContent = name_input.value;
	wrapper.appendChild(text_span)
	new_li.appendChild(wrapper);

	let close_span = document.createElement("span");
	close_span.className = "close-button";
	close_span.innerHTML = "X";
	close_span.addEventListener("click", ev => {
		if(modify_list === true){
			eliminateTask(ev.target.parentElement);
		}
	})
	new_li.appendChild(close_span);

	task_list.appendChild(new_li);
	setTimeout(function(){new_li.style.width = "100%";}, 1);
	setTimeout(function(){close_span.style.visibility = "visible";}, 1200);

	name_input.value = "";
	description_input.value = "";

	checkListVisibility();
	modify_list = true;
	
}



/* Receives the index from the close button
which is then used to eliminate the task from the list
and select the corresponding dom element, which is removed.
Then all remaining buttons get a new id. */
function eliminateTask(li){

	modify_list = false;

	elements_list.splice(li.id, 1)

	li.style.width = "0";

	setTimeout(function(){
		task_list.removeChild(li);
		let all_list_items = document.querySelectorAll(".list-item");
		for(let i = 0; i < elements_list.length; i++){
			all_list_items[i].id = i;
		}
		checkListVisibility();
		modify_list = true;
	}, 800);
}



const modal_box = document.querySelector("#modal-box");
const modal_name = document.querySelector("#modal-name");
const modal_state = document.querySelector("#modal-state");
const modal_added_date = document.querySelector("#modal-added-date");
const modal_description = document.querySelector("#modal-description");
const modal_close = document.querySelector("#modal-close");
modal_close.addEventListener("click", () => {
	modal_box.style.display = "none";
});

function displayModalBox(index){
	let t = elements_list[index];
	modal_name.textContent = `Name: ${t.name}`;
	modal_state.textContent = `State: ${t.state}`;
	let date_info = `${t.added_date.getHours()}:${t.added_date.getMinutes()} ${t.added_date.getDate()}-${t.added_date.getMonth()}-${t.added_date.getFullYear()}`
	modal_added_date.textContent = `Date Created: ${date_info}`;
	modal_description.textContent = `Name: ${t.description}`;
	modal_box.style.display = "block"
}

























