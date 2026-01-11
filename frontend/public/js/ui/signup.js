import {signupUser} from "../services/auth.js";

export async function signup(){ 
const btn = document.getElementById('signupbtn');
if(!btn){ 
return;
}
btn.addEventListener('click' , async()=>{ 
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
if(!name || !email || !password){ 
return alert('Name , email and pasword all required');
}
if(password.length < 6){ 
return alert('Password should be greater than or equal to 6 characters');
}
try{ 
await signupUser(name , email , password);
alert('User signup successfully');
window.location.href='../../pages/signin.html';
}catch(err){ 
console.log(err.message , "from signup user");
alert('User signup failed');
}
});
};
