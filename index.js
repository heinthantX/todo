const ul = document.getElementById('ul');
const addInput = document.getElementById('add-input');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');

// let todoList = localStorage.getItem('todoList')
//   ? stringObjToArrayObj(localStorage.getItem('todoList'))
//   : [];
const url =
  'https://crudcrud.com/api/53ef30c155524469aa325eb6de128f8a/todolist';
function getDataFromServer() {
  return fetch(url)
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
}

let todoList = getDataFromServer().then((data) => {
  todoList = data;
  renderTodo(todoList);
});

function createTodo(todo, i) {
  const li = document.createElement('li');
  li.className = 'flex items-center justify-between';

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.checked = todo.check;
  checkBox.className = 'accent-[#a683e3] cursor-pointer';

  const span = document.createElement('span');
  span.innerText = todo.text;
  span.className = checkBox.checked ? 'line-through  decoration-gray-500' : '';

  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 w-3/4 cursor-pointer';
  div.append(checkBox, span);
  div.onclick = (e) => {
    doneTodo(e, i);
  };

  const editButton = document.createElement('button');

  const editImg = document.createElement('img');
  editImg.src = './src/images/icons8-edit-30.png';
  editImg.width = '25';
  editButton.appendChild(editImg);
  editButton.onclick = (e) => {
    editTodo(e, i);
  };
  editButton.onmouseover = () => {
    editImg.src = './src/images/icons8-edit.gif';
  };
  editButton.onmouseout = () => {
    editImg.src = './src/images/icons8-edit-30.png';
  };

  const trashButton = document.createElement('button');

  const trashImg = document.createElement('img');
  trashImg.src = './src/images/icons8-trash-48.png';
  trashImg.width = '30';
  trashButton.appendChild(trashImg);
  trashButton.onclick = (e) => {
    deleteTodo(e, i);
  };
  trashButton.onmouseover = () => {
    trashImg.src = './src/images/icons8-trash.gif';
  };
  trashButton.onmouseout = () => {
    trashImg.src = './src/images/icons8-trash-48.png';
  };

  li.append(div, editButton, trashButton);
  return li;
}

function renderTodo(todoList) {
  todoList.forEach((todo, i) => {
    const li = createTodo(todo, i);
    ul.appendChild(li);
  });
}

function addTodoToServer(todo) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));
}

addInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  const input = e.target;
  const { value } = input;
  const { className } = input;
  if (value == '') return;
  if (className.includes('edit')) {
    const i = className.slice(55);

    todoList = todoList.map((todo, index) => {
      todo.text = i == index ? value : todo.text;
      return todo;
    });
    updateTodoFromServer(todoList[i]);
    input.classList.remove(`edit${i}`);
    input.value = '';

    ul.innerHTML = '';
    renderTodo(todoList);
  } else {
    const todo = { check: false, text: value };
    addTodoToServer(todo).then((data) => todoList.push(data));
    const li = createTodo(todo, todoList.length - 1);
    ul.appendChild(li);
    input.value = '';
  }
});

function deleteTodoFromServer(todo) {
  return fetch(`${url}/${todo._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function deleteTodo(e, i) {
  const li = e.target.parentNode.parentNode;
  li.remove();
  deleteTodoFromServer(todoList[i]);
  todoList = todoList.filter((v, index) => i != index);
}

function updateTodoFromServer(todo) {
  return fetch(`${url}/${todo._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      check: todo.check,
      text: todo.text,
    }),
  }).catch((e) => console.log(e));
}
function doneTodo(e, i) {
  todoList = todoList.map((todo, index) => {
    if (index === i) {
      todo.check = !todo.check;
      return todo;
    } else {
      return todo;
    }
  });
  updateTodoFromServer(todoList[i]);
  ul.innerHTML = '';
  renderTodo(todoList);
}

function editTodo(e, i) {
  const span = e.target.parentNode.previousSibling;
  addInput.value = span.innerText;
  addInput.focus();
  addInput.classList.add(`edit${i}`);
}

saveBtn.onmouseover = (e) => {
  const saveImg = e.target;
  saveImg.src = './src/images/icons8-save.gif';
};
saveBtn.onmouseout = (e) => {
  const saveImg = e.target;
  saveImg.src = './src/images/icons8-save-64.png';
};

saveBtn.addEventListener('click', (e) => {
  saveTodo(e);
});

function saveTodo(e) {
  const stringObj = arrayObjToStringObj(todoList);
  localStorage.setItem('todoList', stringObj);
}

function arrayObjToStringObj(arr) {
  const obj = Object.assign({}, arr);
  const stringObj = JSON.stringify(obj);
  return stringObj;
}

function stringObjToArrayObj(stringObj) {
  const obj = JSON.parse(stringObj);
  const array = Object.values(obj);
  return array;
}

clearBtn.onclick = (e) => {
  localStorage.clear();
  location.reload();
};
