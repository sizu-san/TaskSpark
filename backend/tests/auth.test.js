const request = require("supertest");
const app = require("../src/app.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let token;
describe("Authentication routes" , () => { 
describe("Signup" , () => { 
test("signup success" , async() => { 
const res = await request(app)
	.post("/auth/signup")
	.send({
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});

	expect(res.statusCode).toBe(201);
	expect(res.body).toHaveProperty("message");
});
test("signup with existing email" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});

const res = await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});
	expect(res.statusCode).toBe(409);
	expect(res.body).toHaveProperty("message");
});

test("signup with weak password" , async() => { 
const res = await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example",
	password:"1234"
	});

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});

test("signup with invalid email" , async() => { 
const res = await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"testexan,co",
	password:"123456"
	});

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});
});
describe("Signin" , () => { 

test("signin success" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});

const res = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"test@example.com",
	password:"123456"
	});
        token = res.body.token;
	expect(res.statusCode).toBe(200);
	expect(res.body).toHaveProperty("token");
});

test("signin before signup" , async() => { 
const res = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"test@example.com",
	password:"123456"
	});

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});

test("wrong password" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@exmaple.com",
	password:"123456"
	});

const res = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"test@example.com",
	password:"234567"
	});

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});

test("wrong email" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});

const res = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"wrong@example.com",
	password:"123456"
	});

	expect(res.status).toBe(401);
	expect(res.body).toHaveProperty("message");

});
});
});

describe("Authorization" , () => { 
test("No authorization header" , async() => { 
const res = await request(app)
	.get("/users/todos");

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});

test("Bearer missing" ,async() => { 
const res = await request(app)
	.get("/users/todos")
	.set("Authorization" , `${token}`);

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});

test("Invalid jwt" , async() => { 
const res = await request(app)
	.get("/users/todos")
	.set("Authorization" , `Bearer ${token}+1`);

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});

test("expired jwt" , async() => { 
const expiredjwttoken = jwt.sign({userId:new mongoose.Types.ObjectId()},process.env.JWT_SECRET, {expiresIn : "-1s"});

const res = await request(app)
	.get("/users/todos")
	.set("Authorization" , `Bearer ${expiredjwttoken}`);

	expect(res.statusCode).toBe(401);
	expect(res.body).toHaveProperty("message");
});
});

describe("todo test" , () => { 
test("token of User B accessing User A data unsuccessful" , async() => { 
let Atoken;
let AtodoId;

await request(app)
	.post("/auth/signup")
	.send({ 
	name:"Test User",
	email:"test@example.com",
	password:"123456"
	});

const UserA = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"test@example.com",
	password:"123456"
	});

	Atoken = UserA.body.token;
const resA = await request(app) 
	.post("/users/todos")
	.send({ 
	title:"eat",
	description:"eat dinner at 6pm",
	completed:false,
	})
	.set("Authorization" , `Bearer ${Atoken}`);

	AtodoId = resA.body._id;

let Btoken;
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"User 2",
	email:"user2@example.com",
	password:"234567"
	});

const UserB = await request(app)
	.post("/auth/signup")
	.send({ 
	email:"user2@example.com",
	password:"234567"
	});

	Btoken = UserB.body.token;

const res2A = await request(app)
	.put(`/users/todos/${AtodoId}`)
	.send({ 
	title:"eat dinner"
	})
	.set("Authorization" , `Bearer ${Btoken}`);

	expect([401,403]).toContain(res2A.statusCode);
	expect(res2A.body).toHaveProperty("message");
});
});

describe("todos Crud success path" , () => { 
let Token;
test("adding todo successful" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

	Token = user.body.token;
const res = await request(app)
	.post("/users/todos")
	.send({ 
	title:"eat",
	description:"eat dinner at 6pm",
	completed:false
	})
	.set("Authorization" , `Bearer ${token}`);

	expect(res.statusCode).toBe(201);
	expect(res.body).toHaveProperty("message");
});

test("get empty todo" , async() => { 
let token;
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user =await  request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

	token = user.body.token;
const res = await request(app)
	.get("/users/todos")
	.set("Authorization" , `Bearer ${token}`);

	console.log(res.body , "body");
	expect(res.statusCode).toBe(200);
	expect(res.body).toHaveProperty("message");
});

test("get all todo successfully" , async() => { 
let token ;
await request(app)
	.post("/auth/signup")
	.send({
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});
 
	token = user.body.token;
await request(app)
	.post("/users/todos")
	.send({ 
	title:"sleep",
	description:"sleep for 8 hours",
	completed:false
	})
	.set("Authorization" , `Bearer ${token}`);

const res = await request(app) 
	.get("/users/todos")
	.set("Authorization" , `Bearer ${token}`);
	
	console.log(res.body.allTodos);
	expect(res.statusCode).toBe(200);
	expect(res.body).toHaveProperty("message");
});

test("Update todo successful" , async() => { 
let token;
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456",
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

	token = user.body.token;
const newtodo = await request(app)
	.post("/users/todos")
	.send({ 
	title:"sleep",
	description:"sleep for 8 hours",
	completed:false
	})
	.set("Authorization" , `Bearer ${token}`);

let todoId = newtodo.body.todo[0]._id;

const res = await request(app) 
	.put(`/users/todos/${todoId}`)
	.send({ 
	completed:true
	})
	.set("Authorization" , `Bearer ${token}`);

	expect(res.statusCode).toBe(200);
	expect(res.body).toHaveProperty("message");
});

test("delete todo successfully" , async() => { 

await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

let token = user.body.token;
const newTodo = await request(app)
	.post("/users/todos")
	.set("Authorization" , `Bearer ${token}`)
	.send({ 
	title:"sleep",
	description:"sleep for 8 hours",
	completed:false
	});

let todoId = newTodo.body.todo[0]._id;
const res = await request(app)
	.delete(`/users/todos/${todoId}`)
	.set("Authorization" , `Bearer ${token}`);

	expect(res.statusCode).toBe(200);
	expect(res.body).toHaveProperty("message");
});
});

describe("todo validation" , () => { 

test("create todo without title" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

let token = user.body.token;
const res = await request(app)
	.post("/users/todos")
	.send({ 
	description:"go to sleep",
	completed:false
	})
	.set("Authorization" , `Bearer ${token}`);

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});

test("create todo with empty title" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

let token = user.body.token;
const res = await request(app)
	.post("/users/todos")
	.send({ 
	title:"",
	description:"go to sleep",
	completed:false
	})
	.set("Authorization",`Bearer ${token}`);

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});

test("update todo with invalid id unsccessful" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

let token = user.body.token;
const newTodo = await request(app)
	.post("/users/todos")
	.set("Authorization" , `Bearer ${token}`)
	.send({ 
	title:"sleep",
	description:"sleep for 8 hours",
	completed:false
	});

let todoId = newTodo.body.todo[0]._id;

const res = await request(app)
	.put(`/users/todos/${todoId}+1`)
	.set("Authorization" , `Bearer ${token}`)
	.send({ 
	completed:true
	});

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});

test("delete todo with invalid id unsuccessful" , async() => { 
await request(app)
	.post("/auth/signup")
	.send({ 
	name:"user",
	email:"user@example.com",
	password:"123456"
	});

const user = await request(app)
	.post("/auth/signin")
	.send({ 
	email:"user@example.com",
	password:"123456"
	});

let token = user.body.token;
const newTodo = await request(app)
	.post("/users/todos")
	.set("Authorization" , `Bearer ${token}`)
	.send({ 
	title:"sleep",
	description:"go to sleep",
	completed:false
	});

let todoId = newTodo.body.todo[0]._id;
const res = await request(app)
	.delete(`/users/todos/${todoId}+1`)
	.set("Authorization" , `Bearer ${token}`);

	expect(res.statusCode).toBe(400);
	expect(res.body).toHaveProperty("message");
});
});
/* 
token of user b accessing user  A data unsuccessful  -> 401,403
(todo validation)
create todo without title unsuccessful -> 400
create todo with empty title -> 400
update todo with invalid id unsuccessful -> 400
delete todo with invalid id unsuccessful -> 400

todos crud (todo Crud success path) 
adding todo successful -> 201 ( show todo also)
get empty todo -> 200 (show todo also)
get all todo successful -> 200 (show todo also)
update todo successful -> 200 (show todo also)
delete todo successful ->200 (show only message)


 */
