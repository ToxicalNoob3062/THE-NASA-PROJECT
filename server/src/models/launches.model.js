const axios = require("axios");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

let latestLaunch = 100;

async function findLaunch(filter) {
  return await launches.findOne(filter);
}
async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getAllLaunches(limit, skip) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .skip(skip)
    .limit(limit)
    .sort({ flightNumber: 1 });
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
  return launch;
}

async function getLatestFilghtNumber() {
  const latest = await launches.findOne().sort("-flightNumber");
  return latest ? latest.flightNumber : latestLaunch;
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("You cannot live in this planet!");
  }
  launch = Object.assign(launch, {
    flightNumber: (await getLatestFilghtNumber()) + 1,
    success: true,
    upcoming: true,
    customers: ["R-SpacioStation", "Spacex"],
  });
  return await saveLaunch(launch);
}

async function getLaunchByID(id) {
  const launch = await launches.findOne({ flightNumber: id });
  return launch ? launch : null;
}
async function abortLaunch(flightNumber) {
  const abort = await getLaunchByID(+flightNumber);
  if (abort) {
    abort.upcoming = false;
    abort.success = false;
    await saveLaunch(abort);
    return abort;
  } else
    return {
      error: "This mission was not launched!",
    };
}
const spacexAPI = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("loading launches data...");
  const res = await axios.post(spacexAPI, {
    "query": {},
    "options": {
      "pagination": false,
      "populate": [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (res.status !== 200) {
    throw new Error("Something went wrong while fectching launches from spacex api");
  }
  const launchDocs = res.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload.customers);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("data already exists in database");
  } else {
    await populateLaunches();
  }
}
module.exports = {
  loadLaunchData,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
