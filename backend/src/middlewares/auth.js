const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
module.exports = (req, res,next) => { 
const tokenHeader = req.headers.authorization;
if(!tokenHeader || !tokenHeader.startsWith("Bearer ")){ 
throw new AppError("token not found" , 401);
return res.status(401).json({message:"Token not found"});
}

try{ 
const token = tokenHeader.split(" ")[1];
const decoded = jwt.verify(token , process.env.JWT_SECRET);
req.user = decoded;
next();
}catch(err){ 
console.log(err.message);
return res.status(401).json({message:err.message});
}
};
