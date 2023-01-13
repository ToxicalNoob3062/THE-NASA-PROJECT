const express = require("express");
const planetController = require("./planets.controller");
const planetRouter = express.Router();

//requests
planetRouter.get("/", planetController.httpGetAllPlanets);

//exports
module.exports = planetRouter;
