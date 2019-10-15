const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan"); //logging framework
const http = require("http");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

//db setup
mongoose.connect(
  "mongodb://gaurav:Gaurav12345678@ds119304.mlab.com:19304/bridgedb",
  { useNewUrlParser: true }
);
//app setup
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server running at port:", port);
