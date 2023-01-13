//express
const express = require("express");

//routing
const planetRouter = require("../routes/planets/planets.router");
const launchesRouter = require("../routes/launches/launches.router");

//v1;
const v1 = express.Router();

//routes
v1.use("/planets", planetRouter);
v1.use("/launches", launchesRouter);

module.exports = v1;
