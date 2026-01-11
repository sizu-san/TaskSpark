require("dotenv").config({path:"../.env"});
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
connectDB();
const globalerr = require("./middlewares/globalerr");
const cors = require("cors");
app.use(cors({ 
	origin:'http://localhost:5500',
	methods:["GET" , "POST" , "PUT" , "DELETE"],
	allowedheaders:['Content-Type' , 'Authorization'],
	credentials:true,
}));
app.use(express.json());
const authRoutes = require("./routes/auth.routes");
app.use("/auth" , authRoutes);
const todosRoutes = require("./routes/todo.routes");
app.use("/users" , todosRoutes);
app.use(globalerr);
app.listen(PORT , () => { 
console.log(`Server running on port ${PORT}`);
});

//module.exports = app;
