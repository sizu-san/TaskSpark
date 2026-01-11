import {getTodo , createTodo ,deleteTodo , updateTodo} from '../services/dashboard.js';


export async function getalltodos(){ 
if (!document.getElementById('dashboard')){return;}

try{ 
const user = await getTodo();
renderTodos(user.allTodos);
setupFilters();
}catch(err){ 
console.log(err , "from ui dashboard");
}
}

function setupFilters(){ 
const allTasksbtn = document.getElementById('All-tasks');
const completedbtn = document.getElementById('completed-btn');
const todoContainer = document.querySelector('.todos');
const message = document.getElementById('message');
allTasksbtn.addEventListener('click' , async() => { 
completedbtn.style.backgroundColor = '#323743';
completedbtn.style.color='#bdc1ca';
allTasksbtn.style.backgroundColor = '#A65DE9';
allTasksbtn.style.color = '#000000';
//ACTIVE_FILTER = 'all';
const user = await getTodo();
renderTodos(user.allTodos);
});

completedbtn.addEventListener('click' , async() => { 
completedbtn.style.backgroundColor = '#A65DE9';
completedbtn.style.color='#000000';
allTasksbtn.style.backgroundColor = '#323743';
allTasksbtn.style.color = '#bdc1ca';
//ACTIVE_FILTER = 'completed';
const user = await getTodo();
const completedTodos = user.allTodos.filter(todo => todo.completed);
if(completedTodos.length == 0){ 
message.innerHTML = 'No task completed yet';
message.style.display = 'block';
todoContainer.innerHTML = '';
return;
}
renderTodos(completedTodos);
todoContainer.addEventListener('click' , async(e) => { 
const todoElement = e.target.closest('.main-container');
const todoid = todoElement.dataset.id;

if(e.target.classList.contains('completed')){ 
let inputchecked = e.target.checked;
if(inputchecked == false){ 
todoElement.remove();
}
}
});
});
}

function renderTodos(todos){ 
const todoContainer = document.querySelector('.todos');
const todoTemplate = document.querySelector('.main-container');
const message = document.getElementById('message');

todoContainer.innerHTML = '';

if(todos.length === 0){ 
message.innerHTML = 'No Tasks Created Yet';
message.style.display = 'block';
return;
}

message.style.display='none';

todos.forEach(todo => { 
const newTodo = todoTemplate.cloneNode(true);
newTodo.hidden = false;
newTodo.dataset.id = todo._id;

newTodo.querySelector('#show-title').textContent = todo.title;
newTodo.querySelector('.todo-description').textContent = todo.description;
newTodo.querySelector('.completed').checked = todo.completed;

todoContainer.append(newTodo);

});
}


export async function createTodoUI(){ 
if(!document.getElementById('dashboard')){return;} 
const btn = document.getElementById('create-todo');

btn.addEventListener('click' , async () => { 
const title = document.getElementById("title").value;
const description = document.getElementById('description').value;
if(!title || !description){ 
return alert('Title and Description both required');
}
const message = document.getElementById('message');
const todoContainer = document.querySelector('.todos');
const todoTemplate = document.querySelector('.main-container');

try{ 
const user = await createTodo(title,description);
renderTodos(user.todo);
}catch(err){ 
console.log(err , "from ui dashboard");
}
});
}


export async function deleteTodoUI(){ 
if(!document.getElementById('dashboard')){return;}
const todoContainer = document.querySelector('.todos');
const message = document.querySelector('#message');

todoContainer.addEventListener('click' , async(e) => { 
if(e.target.classList.contains('delete-btn')){
const todoElement = e.target.closest('.main-container');
const todoid = todoElement.dataset.id;
try{ 
await deleteTodo(todoid);
todoElement.remove();
if(!todoContainer.innerHTML){ 
message.style.display='block';
message.innerHTML = 'No Task Created Yet';
return;
}
}catch(err){ console.log(err , "from ui Dashboard");}
}});
}


export async function editTodoUI(){ 
if(!document.getElementById('dashboard')){return;}
const todoContainer = document.querySelector('.todos');

todoContainer.addEventListener('click' , async(e)=> { 
const todoElement = e.target.closest('.main-container');
const todoid = todoElement.dataset.id;
const textarea = document.querySelector('.todo-description');
const savebtn = document.querySelector('.save-btn');
const editbtn = document.querySelector('edit-btn');
const completed = document.querySelector('.completed');
const showCompletedTodo = document.getElementById('completed-btn');

/* edit-btn */
if(e.target.classList.contains('edit-btn')){ 
textarea.removeAttribute('readonly');
textarea.focus();
const length = textarea.value.length;
textarea.setSelectionRange(length , length);
savebtn.style.display = 'block';
}

/* save btn*/
if(e.target.classList.contains('save-btn')){ 
const payload ={ description: textarea.value};
await updateTodo(todoid ,payload);
savebtn.style.display='none';
}

/* completed btn*/
if(e.target.classList.contains('completed')){ 
let inputchecked = e.target.checked;
const payload = { completed:inputchecked};
const user = await updateTodo(todoid , payload);
e.target.checked = user.todo.completed;
}}); 
}
