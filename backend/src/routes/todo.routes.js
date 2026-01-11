const express = require("express");
const route = express.Router();
const todoControllers = require("../controllers/todo.controllers");
const auth = require("../middlewares/auth");

route.post("/todos", auth , todoControllers.createTodo);
route.get("/todos" , auth , todoControllers.allTodos);
route.put("/todos/:id" , auth , todoControllers.updateTodo); //update todo(title/completed)
route.delete("/todos/:id" , auth , todoControllers.deleteTodo); //delete todo
module.exports = route;
