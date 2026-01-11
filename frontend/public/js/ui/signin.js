import {signinUser} from '../services/auth.js';

export async function signin(){ 
const btn = document.getElementById("signinbtn");

if(!btn){ 
return;
}
btn.addEventListener("click" , async()=>{ 
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
if(!email || !password){ 
return alert('Email and Password both are required!');
}
if(password.length < 6){ 
return alert('Password should be greater than or equal to 6 characters');
}
try{ 
await signinUser(email,password);
alert("User signin successful");
window.location.href='../../pages/dashboard.html';
}catch(err){ 
console.log(err , "from signin user");
alert("User signin failed");
}
});
};
