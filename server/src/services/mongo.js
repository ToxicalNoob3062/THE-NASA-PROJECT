const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://Rahat:iKXK7KcrNfwa3rBS@nasa-mission-launch.v1xnnow.mongodb.net/?retryWrites=true&w=majority";

//check db connection
mongoose.connection.once("open", () => {
  console.log("DB is ready!");
});

//check db errors
mongoose.connection.on("error", (err) => {
  console.error(err);
});

//connect to database
async function loadDatabase() {
  await mongoose.connect(MONGO_URL);
}

module.exports = loadDatabase;
