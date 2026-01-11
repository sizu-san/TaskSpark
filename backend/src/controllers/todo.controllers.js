const todosServices = require("../services/todo.services");

exports.createTodo = async(req,res,next) => { 
try{ 
 const todoData = req.body;
 const userData = req.user;
 if(!todoData){ 
 return res.status(401).json({message:"title , description and completed required"});
 }

const todo =  await todosServices.newTodo(todoData , userData);
 return res.status(201).json({message:"Todo created successfully" , todo});
}catch(err){next(err);}
};

exports.allTodos = async(req,res,next) => { 
try{ 
const userData = req.user;
const allTodos = await todosServices.Todos(userData);
return res.status(200).json({message:"Todos" , allTodos});
}catch(err){next(err);}
};

exports.updateTodo = async(req,res,next) => { 
try{ 
const todoData = req.body;
const todoId = req.params.id;
const todo = await todosServices.updateTodoById(todoId , todoData);
return res.status(200).json({message:"Todo updated successfully" , todo});
}catch(err){next(err);}
};

exports.deleteTodo = async(req,res,next) => { 
try{ 
const todoId = req.params.id;
await todosServices.deleteTodoById(todoId);
return res.status(200).json({message:"Todo deleted successfully"});
}catch(err){next(err);}
};
