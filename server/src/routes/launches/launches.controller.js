const { getAllLaunches, addNewLaunch, abortLaunch } = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

//getters
async function httpGetAllLaunches(req, res) {
  const { limit, skip } = getPagination(req.query);
  return res.status(200).json(Array.from(await getAllLaunches(limit, skip)));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);
  return res.status(201).json(await addNewLaunch(launch));
}

async function httpAbortLaunch(req, res) {
  const flightNumber = req.params.id;
  const abort = await abortLaunch(flightNumber);
  return res.status(abort.error ? 400 : 200).json(abort);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
