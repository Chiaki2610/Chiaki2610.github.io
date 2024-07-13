const todoInput = document.querySelector(".myInput");
const addBtn = document.querySelector(".addBtn");
const key = "todoList";
const todoListGroup = document.querySelector("#todoListGroup");

// function setItemKey() {
//   let keyVal = Date.now() + "_" + Math.random().toString(10);
//   return keyVal;
// }

addBtn.addEventListener("click", function (event) {
  const todoContent = todoInput.value.trim();
  if (!todoContent) return;
  const todoInputKey = new Date().valueOf();

  const todoItem = {
    id: todoInputKey,
    content: todoContent,
    isDone: false,
  };

  saveTodoItem(todoItem);
  renderingTodoList();
});
// editBtn.addEventListener("click", () => {
//   if (listItem.value === null) {
//     return;
//   }
//   editBtn.setAttribute("style", "display:none;");
//   saveBtn.setAttribute("style", "display:contents;");
//   listItem.readOnly = false;
//   return;
// });

window.addEventListener("load", function (event) {
  renderingTodoList();
});

function renderingTodoList() {
  const todoList = getTodoListFromStorage();
  if (!todoList) return;
  todoListGroup.innerHTML = "";
  todoList.forEach((item) => {
    todoListGroup.innerHTML += createTodoItemHTML(item);
  });
}
function getTodoListFromStorage() {
  const localStorageItem = localStorage.getItem(key);
  return localStorageItem ? JSON.parse(localStorageItem) : [];
}
function createTodoItemHTML(todoItem) {
  return `<li class="list-group-item">
            <div class="input-group" data-id="${todoItem.id}">
              <div class="input-group-text">
                <input
                  class="form-check-input mt-0"
                  type="checkbox"
                  oninput="isDoneCheck(${todoItem.id})"
                  ${todoItem.isDone ? "checked" : ""}
                />
              </div>
              <input
                type="text"
                class="form-control todo-content"
                aria-label="Text input with checkbox"
                value="${todoItem.content}"
                disabled
              />
              <button class="btn btn-success save-btn d-none" type="button" onclick="save(${
                todoItem.id
              }, this)">
              儲存</button>
              <button class="btn btn-warning" type="button" onclick="edit(${
                todoItem.id
              }, this)">編輯</button>
              <button class="btn btn-danger" type="button" onclick="remove(${
                todoItem.id
              }, this)">刪除</button>
            </div>
          </li>`;
}
function isDoneCheck(id) {
  const todoList = getTodoListFromStorage();
  const todoItem = todoList.find((item) => item.id === id);
  todoItem.isDone = !todoItem.isDone;
  saveTodoListToStorage(todoList);
}
function save(id, el) {
  const todoContent = el.parentElement.querySelector(".todo-content");
  const val = todoContent.value.trim();
  if (!val) return;

  const todoList = getTodoListFromStorage();

  const todoItem = todoList.find((item) => item.id === id);
  todoItem.content = val;
  saveTodoListToStorage(todoList);
  renderingTodoList();
}
function saveTodoListToStorage(todoList) {
  const json = JSON.stringify(todoList);
  localStorage.setItem(key, json);
  console.log(`Saved: ${key} → ${json}`);
}
function edit(id, el) {
  const todoContent = el.parentElement.querySelector(".todo-content");
  todoContent.disabled = false;
  const saveBtn = el.parentElement.querySelector(".save-btn");
  saveBtn.classList.remove("d-none");
  el.classList.add("d-none");
}
function remove(id, el) {
  const todoList = getTodoListFromStorage();
  const todoItemIdx = todoList.findIndex((item) => item.id === id);
  todoList.splice(todoItemIdx, 1);
  saveTodoListToStorage(todoList);
  renderingTodoList();
}
function saveTodoItem(todoItem) {
  const todoList = getTodoListFromStorage();
  todoList.push(todoItem);
  saveTodoListToStorage(todoList);
}
