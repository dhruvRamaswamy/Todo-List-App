// I don't feel like using private members ('#') so '_' means a property is private
"use strict";
const LOCAL_STORAGE_LISTS_KEY = "tasks.list";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
const listDisplayContainer = document.querySelector(
  "[data-list-display-container"
);
const listTitle = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_KEY)) || [];
let selectedListID =
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || null;
// const Task = class Task {
//   constructor(quote) {
//     this.quote = quote;
//   }
//   //   we will see what we need
//   //   get id() {
//   //     return this._id;
//   //   }
// };
// const List = class List {
//   static _idCounter = 1;
//   constructor(name) {
//     this.name = name;
//     this._tasks = [];
//     this._id = List._idCounter;
//     List._idCounter++;
//   }

//   //   deleteTask(id) {} write this later

//   get tasks() {
//     return this._tasks;
//   }

//   get id() {
//     return this._id;
//   }

//   addTask(content) {
//     this._tasks.push(new Task(content));
//   }
// };

const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteBtn = document.querySelector(".delete-btn");

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListID = e.target.dataset.listId;
    saveAndRenderLists();
  }
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") {
    // TODO: create popup to tell that they need to type something
    return;
  }
  let newList = createList(newListInput.value);
  lists.push(newList);
  newListInput.value = "";
  saveAndRenderLists();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") {
    // TODO: create popup to tell that they need to type something
    return;
  }
  let task = createTask(taskName);
  console.log(newListInput);

  console.log(newListInput.value);
  const selectedList = lists.find((list) => list.id === selectedListID);
  selectedList.tasks.push(task);
  newTaskInput.value = "";
  saveAndRenderLists();
});

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

// Renders the list
function renderAllLists() {
  clearElement(listsContainer);
  renderLeftLists();
  // Finds the selected list from our list
  const selectedList = lists.find((list) => list.id === selectedListID);
  if (selectedListID == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
  }
  clearElement(tasksContainer);
  renderTasks(selectedList);
}

function renderTasks(selectedList) {
  if (selectedList == null) {
    return;
  }
  selectedList.tasks.forEach((task) => {
    // clone a given NodeElement on the DOM. THe second argument, true, will make sure that everything in the element is cloned, not just the first div
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    // To get/set which input element the label belongs to
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTasks = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const tasksString = incompleteTasks !== 1 ? "tasks" : "task";
  listCountElement.textContent = `${incompleteTasks} ${tasksString} remaning`;
}

function renderLeftLists() {
  for (let listItem of lists) {
    let listElement = document.createElement("li");
    // setting innerHTML to the name of the list
    listElement.innerHTML = listItem.name;
    listElement.dataset.listId = listItem.id;
    if (listItem.id === selectedListID) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  }
}

function clearElement(element) {
  element.innerHTML = "";
}

function saveAndRenderLists() {
  saveLists();
  renderAllLists();
}

function saveLists() {
  localStorage.setItem(LOCAL_STORAGE_LISTS_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListID);
}

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [
      {
        id: "sdfsd",
        name: "Test",
        complete: true,
      },
    ],
  };
}

deleteBtn.addEventListener("click", () => {
  lists = lists.filter((list) => list.id !== selectedListID);
  console.log(lists);
  selectedListID = null;
  saveAndRenderLists();
});

renderAllLists();

function clearInput(inputElement) {}
