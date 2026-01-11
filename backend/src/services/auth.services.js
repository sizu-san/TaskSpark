const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const AppError = require("../utils/AppError");

exports.signupUser = async(data) => { 
const existingUser = await User.findOne({email:data.email});
if(existingUser){ 
throw new AppError("User exists" , 409);
}
const hashedPassword = await bcrypt.hash(data.password , 10);
return await User.create({name:data.name , email:data.email , password:hashedPassword});
};

exports.signinUser = async(data) => { 
const user = await User.findOne({email:data.email});
if(!user){ 
throw new AppError("Invalid email or password" , 401);
}

const isMatch = await bcrypt.compare(data.password , user.password);
if(!isMatch){ 
throw new AppError("Invalid email or password" , 401);
}

const token = jwt.sign({ 
	id:user._id , email:user.email
} , process.env.JWT_SECRET, {expiresIn:"1d"});

return token;
};


