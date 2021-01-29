const elements_list = [];

const no_task_info = document.querySelector("#no-task-info");
const task_list = document.querySelector("#task-list");

const task_input = document.querySelector("#task-input");
task_input.addEventListener("keyup", (ev) => {
	if(ev.keyCode === 13){
		createTask();
	}
});
const submit_button = document.querySelector('#submit-button');
submit_button.addEventListener("click", createTask);



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
	elements_list.push(task_input.value);
	let new_li = document.createElement("li");
	new_li.className = "list-element";

	let text_span = document.createElement("span");
	text_span.className = "text-span"
	text_span.textContent = task_input.value;
	new_li.appendChild(text_span);

	let close_span = document.createElement("span");
	close_span.id = `${elements_list.length}-close-button`;
	close_span.className = "close-button";
	close_span.innerHTML = "&times;";
	close_span.addEventListener("click", (ev) => {
		eliminateTask(ev.target.id);
	})
	new_li.appendChild(close_span);

	task_list.appendChild(new_li);
	setTimeout(function(){new_li.style.width = "100%";}, 1);
	//growLi(new_li);

	task_input.value = "";

	checkListVisibility();
}


/*
function growLi(li){
	width = 0;
	let interval = setInterval(grow, 12);
	function grow(){
		if(width >= 100){
			clearInterval(interval);
		}
		else{
			width++;
			li.style.width = `${width}%`;
		}
	}
}
*/



/* Receives the index from the close button
which is then used to eliminate the task from the list
and select the corresponding dom element, which is removed.
Then all remaining buttons get a new id. */
function eliminateTask(id){

	index = Number(id[0]) - 1;
	elements_list.splice(index, 1)
	let to_be_removed = document.querySelector(`#task-list li:nth-child(${id[0]})`);
	to_be_removed.style.width = "0";
	//shrinkLi(to_be_removed); //And remove li at the end.

	setTimeout(function(){
		task_list.removeChild(to_be_removed);
		let all_close_button = document.querySelectorAll(".close-button");
		for(let i = 0; i < elements_list.length; i++){
			all_close_button[i].id = `${i + 1}-close-button`;
		}
		checkListVisibility();
	}, 1000);
	
}

/*
function shrinkLi(li){
	width = 100;
	let interval = setInterval(shrink, 12);
	function shrink(){
		if(width <= 0){
			clearInterval(interval);
			task_list.removeChild(li);
			let all_close_button = document.querySelectorAll(".close-button");
			for(let i = 0; i < elements_list.length; i++){
				all_close_button[i].id = `${i + 1}-close-button`;
			}
			checkListVisibility();
		}
		else{
			width--;
			li.style.width = `${width}%`;
		}
	}
}
*/