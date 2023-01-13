const express = require("express");
const launchesController = require("./launches.controller");
const launchesRouter = express.Router();

//<---requests--->

//getters
launchesRouter.get("/", launchesController.httpGetAllLaunches);

//setters
launchesRouter.post("/", launchesController.httpAddNewLaunch);

//ommiters
launchesRouter.delete("/:id", launchesController.httpAbortLaunch);

//exports
module.exports = launchesRouter;
