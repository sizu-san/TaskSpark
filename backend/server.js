require("./jest.setup.js");
const app = require("./src/app.js");
const port =process.env.PORT;
const connectDB = require("./src/config/db");
connectDB();
app.listen(port , () => { 
console.log(`Server running on port ${port}`);
});
