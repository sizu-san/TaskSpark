module.exports = (err,req,res,next) => { 
console.log(err.message, "from global error");
const statusCode = err.statusCode || 500;
res.status(statusCode).json({
	success:false ,
	message:err.message+" from global error" || "Internal Server Error"});
};
