const mongoose = require("mongoose");

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
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = loadDatabase;
