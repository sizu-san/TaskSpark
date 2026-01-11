const express = require("express");
const route = express.Router();
const authControllers = require("../controllers/auth.controllers");
const {signupSchema , signinSchema , validate} = require("../validator/validate");
route.post("/signup" , validate(signupSchema) , authControllers.signup);
route.post("/signin" ,validate(signinSchema), authControllers.signin);

module.exports = route;
