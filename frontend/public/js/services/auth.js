import {api} from '../api/api.js';

export async function signupUser(name , email , password){ 
try{ 
const data = await api("/auth/signup" , { 
	method:"POST",
	body:JSON.stringify({name , email , password}),
});
}catch(err){ throw new Error(err , "here");}
}

export async function signinUser(email , password){ 
try{ 
const data = await api("/auth/signin" , { 
	method:"POST",
	body:JSON.stringify({email , password}),
});
	localStorage.setItem("token" , data.token);
}catch(err){ throw new Error(err , "here2");}
}
