const Todo = require("../models/todo.model");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

exports.newTodo = async(todoData, userData) => { 
if(!todoData.title?.trim() || !todoData.description?.trim()){ 
throw new AppError("title and password required" , 400);
}
await Todo.create({title:todoData.title , description:todoData.description , completed:todoData.completed , userId:userData.id});

const todo = await Todo.find({userId:userData.id});
return todo;
};

exports.Todos = async(userData) => { 
return await Todo.find({userId:userData.id});
};

exports.updateTodoById = async(todoId , todoData) => { 
if(!mongoose.Types.ObjectId.isValid(todoId)){ 
throw new AppError("Invalid id" , 400);
}
return await Todo.findByIdAndUpdate(todoId , todoData , {new:true});
};

exports.deleteTodoById = async(todoId) => {
if(!mongoose.Types.ObjectId.isValid(todoId)){ 
throw new AppError("Invalid id" , 400);
}
const todo =  await Todo.findByIdAndDelete(todoId);
return todo;
};
