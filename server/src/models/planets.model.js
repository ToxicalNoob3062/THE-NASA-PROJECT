const parse = require("csv-parse").parse;
const path = require("path");
const fs = require("fs");
const planets = require("./planets.mongo");

const isHabitablePlanet = (planet) => {
  const confirmation = planet["koi_disposition"] === "CONFIRMED";
  const lowerLightLevel = planet["koi_insol"] > 0.3;
  const higherLightLevel = planet["koi_insol"] < 1.11;
  const planetRadi = planet["koi_prad"] < 1.6;
  const exists = confirmation && lowerLightLevel && higherLightLevel && planetRadi;
  return exists;
};

//this function is used to update our planets to database only for once!
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv")) //
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await updateAllPLanets(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        console.log("Habitable Planets Found: ", (await getAllPlanets()).length);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}
async function updateAllPLanets(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
