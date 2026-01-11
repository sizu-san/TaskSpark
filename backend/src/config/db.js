const mongoose = require("mongoose");

const connectDB = async() => { 
try{ 
	await mongoose.connect(process.env.MONGODB_URI);
	console.log("Database connected");
}catch(err){ 
console.log(err.message , "error from database connection");
process.exit(1);
}
};


module.exports = connectDB;
