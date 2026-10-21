// Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");
const filterButtons = document.querySelectorAll("[data-filter]");

//  Data
let tasks = [];
let currentFilter = "all";

// Counter
function updateCounter() {
    let count = 0;
    tasks.forEach(function (task) {
        if (!task.completed) {
            count++;
        }
    });

    if (count === 1) {
        taskCounter.textContent = "1 task left";
    } else {
        taskCounter.textContent = count + " tasks left";
    }
}

// Switch a task between completed and active.
function toggleTask(id) {
    tasks.forEach(function (task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });

    renderTasks();
}

// Delete only the selected task
function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    renderTasks();
}

// Clear completed tasks and keep active tasks
function clearCompleted() {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
}

// Choose which tasks should be shown
function getVisibleTasks() {
    if (currentFilter === "active") {
        return tasks.filter(function (task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        return tasks.filter(function (task) {
            return task.completed;
        });
    }

    return tasks;
}

// Change the filter and update the active button
function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(function (button) {
        if (button.dataset.filter === filter) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    renderTasks();
}

// Render
function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "list-group-item text-center text-muted";
        emptyItem.textContent = "No tasks to show.";
        taskList.appendChild(emptyItem);
    }

    visibleTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input mt-0";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");
        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add("completed");
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger ms-auto";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("aria-label", "Delete task");
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Show or hide the error message
function showError() {
    errorMessage.classList.remove("d-none");
    taskInput.classList.add("is-invalid");
}

function hideError() {
    errorMessage.classList.add("d-none");
    taskInput.classList.remove("is-invalid");
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        showError();
        taskInput.value = "";
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    hideError();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

// Events
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

taskInput.addEventListener("input", hideError);

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        setFilter(button.dataset.filter);
    });
});

// Start
renderTasks();