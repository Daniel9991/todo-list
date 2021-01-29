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
	if(elements_list.length === 0){
		no_task_info.style.display = "block";
		task_list.style.display = "none";
	}
	else if(elements_list.length > 0){
		no_task_info.style.display = "none";
		task_list.style.display = "block";
	}
	else{
		console.log("What the hell happened?");
	}
}

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
	close_span.textContent = "X";
	close_span.addEventListener("click", (ev) => {
		eliminateTask(ev.target.id)
	})
	new_li.appendChild(close_span)

	task_list.appendChild(new_li);

	task_input.value = "";

	checkListVisibility();
}

function eliminateTask(id){

	index = Number(id[0]) - 1;
	elements_list.splice(index, 1)
	let to_be_removed = document.querySelector(`#task-list li:nth-child(${id[0]})`);
	task_list.removeChild(to_be_removed);

	let all_close_button = document.querySelectorAll(".close-button");
	for(let i = 0; i < elements_list.length; i++){
		all_close_button[i].id = `${i + 1}-close-button`;
	}

	checkListVisibility();
}