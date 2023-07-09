const form = document.getElementById('form');
const input = document.querySelector('.form-control');
const tasksList = document.getElementById('tasksList');
const removeDoneTasks = document.getElementById('removeDoneTasks');

let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => {
        renderTask(task);
    });
}
checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', taskDelite);
tasksList.addEventListener('click', taskDone);
removeDoneTasks.addEventListener('click', deliteTaskDone);

function addTask(e) {
    e.preventDefault()

    const taskText = input.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }
    tasks.push(newTask)
    saveToLocalStorage()

    renderTask(newTask);

    input.value = '';
    input.focus()

    checkEmptyList()
}

function taskDelite (e) {
    let self = e.target;

    if (self.dataset.action === 'delete') {
        const parenNode = self.closest('.list-group-item');

        const id = Number(parenNode.id);

        const index = tasks.findIndex(function (task) {
            if(task.id === id) {
                return true;
            }
        })
        tasks.splice(index, 1)

        saveToLocalStorage()
        parenNode.remove()
        checkEmptyList()
    }
}

function taskDone (e) {
    let self = e.target;

    if (self.dataset.action === 'done') {
        const parenNode = self.closest('.list-group-item');
        const taskTitle = parenNode.querySelector('.task-title')
        const id = Number(parenNode.id);

        const task = tasks.find((task) => {
            if(task.id === id) {
                return true;
            }
        });

        task.done = !task.done;
        saveToLocalStorage()

        taskTitle.classList.toggle('task-title--done');
    }
}

function deliteTaskDone() {
    const taskItem = tasksList.children;
    let taskArray = Array.from(taskItem);

    taskArray.forEach(el => {
        const taskTitle = el.querySelector('.task-title')
        if(taskTitle.classList.contains('task-title--done')) {
            el.remove();
        }

    });

    tasks.forEach((el, i) => {
        if(el.done) {
            tasks.splice(i, 1)
        }
    })
    saveToLocalStorage ()
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML =
        `<div id="emptyList" class="empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </div>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    const listItem =
    `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <h2 class="${cssClass}">${task.text}</h2>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action btn-done">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action btn-delete">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;
    tasksList.insertAdjacentHTML('beforeend', listItem);
}