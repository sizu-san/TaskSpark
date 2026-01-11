const base_url = 'https://taskspark-backend.onrender.com';

export async function api(endpoint , options={}){ 
const token = localStorage.getItem('token');
const headers = { 
	'Content-Type':'application/json',
	...(options.headers || {}),
};

if(token){ 
headers.Authorization = `Bearer ${token}`;
}

const response = await fetch(base_url+endpoint , { 
	...options , 
	headers,
});

if(!response.ok){ 
const errData = await response.json();
	throw new Error(errData.message || "Request failed");
}
else{ 
return response.json();
}
}
