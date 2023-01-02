// I don't feel like using private members ('#') so '_' means a property is private
"use strict";
const LOCAL_STORAGE_LISTS_KEY = "tasks.list";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

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

// Renders the list
function renderAllLists() {
  clearElement(listsContainer);
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
  return { id: Date.now().toString(), name: name, tasks: [] };
}

deleteBtn.addEventListener("click", () => {
  lists = lists.filter((list) => list.id !== selectedListID);
  console.log(lists);
  selectedListID = null;
  saveAndRenderLists();
});

renderAllLists();
