const form = document.getElementById('todoForm');
const itemName = document.getElementById('itemName')
const deadline = document.getElementById('deadline')
const priority = document.getElementById('priority')

const todayItems = document.getElementById('todayItems');
const futureItems = document.getElementById('futureItems');
const completedItems = document.getElementById('completedItems');

let todoList =  JSON.parse(localStorage.getItem("todoList")) || [];
if (!Array.isArray(todoList)) {
  todoList = [];
}
window.addEventListener('DOMContentLoaded', renderTodoList);

function renderTodoList(){
  todayItems.innerHTML = "";
  futureItems.innerHTML = "";
  completedItems.innerHTML = "";

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  let todayCount = 1, futureCount = 1, completedCount = 1;

  todoList.forEach((item) => {
    const inputDate = new Date(item.deadline);
    inputDate.setHours(0, 0, 0, 0);

    let listItem = document.createElement("div");
    listItem.classList.add("list-details");
    listItem.setAttribute("data-id", item.id);

    let count, container;
    if (item.completed) {
      count = completedCount++;
      container = completedItems;
      listItem.classList.add("completed-item");
    } else if (inputDate > todayDate) {
      count = futureCount++;
      container = futureItems;
    } else {
      count = todayCount++;
      container = todayItems;
    }

    listItem.innerHTML = `
      <p>${count}. ${item.itemName}</p>
      <p>${item.deadline}</p>
      <p>Priority: ${item.priority}</p>
      <div class="icons-container">
        ${!item.completed ? `
          <i class="fa-regular fa-circle-check complete-icon"></i>
          <i class="fa-regular fa-trash-can delete-icon"></i>
        ` : `
          <i class="fa-regular fa-trash-can delete-icon"></i>
        `}
      </div>
    `;

    if (!item.completed) {
      listItem.querySelector(".complete-icon").addEventListener("click", handleComplete);
    }
    listItem.querySelector(".delete-icon").addEventListener("click", handleDelete);

    container.appendChild(listItem);
  });
}

function handleAddItem(e){
  e.preventDefault();

  const newItem = {
    id: Date.now(),
    itemName: itemName.value,
    deadline: deadline.value,
    priority: priority.value,
    completed: false,
  };

  todoList.push(newItem);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  renderTodoList();
  form.reset();
}
function handleComplete(e) {
  const id = Number(e.target.closest(".list-details").getAttribute("data-id"));
  const index = todoList.findIndex(item => item.id === id);
  if (index !== -1) {
    todoList[index].completed = true;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList();
  }
}

function handleDelete(e) {
  const id = Number(e.target.closest(".list-details").getAttribute("data-id"));
  todoList = todoList.filter(item => item.id !== id);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  renderTodoList();
}

// Helper to get index based on parent element
function getItemIndex(e) {
  const itemDiv = e.target.closest(".list-details");
  const itemId = Number(itemDiv.getAttribute("data-id"));
  return todoList.findIndex(item => item.id === itemId);
}
form.addEventListener('submit', handleAddItem);