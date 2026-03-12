const API = "http://localhost:3000/tasks";

function loadTasks() {

fetch(API)
.then(res => res.json())
.then(tasks => {

const list = document.getElementById("taskList");
list.innerHTML = "";

tasks.forEach(task => {

const li = document.createElement("li");

if (task.isDone) {
li.classList.add("completed");
}

li.innerHTML = `
<span onclick="toggleTask(${task.id})">
${task.title} - ${task.priority}
</span>

<div>
<button onclick="toggleTask(${task.id})">✔</button>
<button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
</div>
`;

list.appendChild(li);

});

});
}

function addTask() {

const title = document.getElementById("taskInput").value;
const priority = document.getElementById("priority").value;

if (title === "") {
alert("Enter task");
return;
}

fetch(API, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ title, priority })
})
.then(() => {
document.getElementById("taskInput").value = "";
loadTasks();
});

}

function toggleTask(id) {

fetch(API + "/" + id + "/status", {
method: "PATCH"
})
.then(() => loadTasks());

}

function deleteTask(id) {

fetch(API + "/" + id, {
method: "DELETE"
})
.then(() => loadTasks());

}

loadTasks();