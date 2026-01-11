const authServices = require("../services/auth.services");

exports.signup = async(req,res,next) => { 
try{ 
const data = req.body;
if(!data){ 
return res.status(401).json({message:"Name,email and password required"});
}
const user=await authServices.signupUser(data);
return res.status(201).json({message:"User signup successfully",user});
}
catch(err){next(err);}
};

exports.signin = async(req,res,next) => { 
try{ 
const data = req.body;
if(!data){ 
return res.status(401).json({message:"Invalid request"});
}
const token = await authServices.signinUser(data);
return res.status(200).json({message:"User signin successfully" , token});
}catch(err){next(err);}
};

