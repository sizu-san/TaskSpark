const {z , ZodError} = require('zod');

const signupSchema = z.object({
	name:z.string(),
	email:z.string().email("Wrong Email"),
	password:z.string().min(6 , "Password should be greater than or equal to 6")
});

const signinSchema = z.object({ 
	email:z.string().email("Wrong Email"),
	password:z.string().min(6 , "Password should be greater than or equal to 6")
});

const validate = (schema) => (req,res,next) => { 
try{ 
schema.parse(req.body);
next();
}catch(err){ 
if(err instanceof ZodError){ 
return res.status(400).json({message:err.issues[0].message+" from zod"});
}
console.log(err.message);
return res.status(500).json({message:"Internal Server Error from zod"});
}
};


module.exports = { signupSchema , signinSchema , validate};
