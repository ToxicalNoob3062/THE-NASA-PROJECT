const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { app } = require("./app");
const { loadLaunchData } = require("./models/launches.model");
const loadDatabase = require("./services/mongo");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

//start server
async function startServer() {
  await loadDatabase();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log("listening to port :", PORT);
  });
}

startServer();
