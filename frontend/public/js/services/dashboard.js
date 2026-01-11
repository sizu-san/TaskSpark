import {api} from "../api/api.js";

export async function getTodo(){ 
return await api('/users/todos', { 
	method:"GET"
});
}

export async function createTodo(title,description){ 
const data = await api('/users/todos', { 
	method:'POST',
	body:JSON.stringify({title,description})
});
return data;
}

export async function deleteTodo(todoid){ 
return await api(`/users/todos/${todoid}` , { 
	method:"DELETE"
});
}

export async function updateTodo(todoid , data){ 
return await api(`/users/todos/${todoid}` , { 
	method:"PUT",
	body:JSON.stringify(data)
});
}
