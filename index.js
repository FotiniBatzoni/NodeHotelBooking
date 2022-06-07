const express = require("express");
const bp = require('body-parser')

const app = express();

require("dotenv").config();
require("./startup/db")();
require("./startup/logging")();

//Body Parser 
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

require("./startup/routes")(app);

const port= process.env.PORT  || 3100;

app.listen(port,()=>console.log(`Listening on port ${port}...`))