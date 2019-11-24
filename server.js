const express = require("express");
const app = express();

app.use("/", express.static(__dirname + "/dist"));

app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
