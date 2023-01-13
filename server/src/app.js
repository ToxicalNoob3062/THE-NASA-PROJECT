const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

//versions
const v1 = require("./versions/v1");

//express app server
const app = express();

//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", v1);

//serving frontend
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
//exports
module.exports = {
  app,
};
