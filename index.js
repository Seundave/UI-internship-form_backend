require("dotenv").config();
const app = require("./app");
const PORT = 5000 || process.env.PORT;
const http = require("http");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  process.exit(1);
});

console.log(process.env.DB_URI)
// connect to database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((err) => console.log(err));

//server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server is running port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  server.close(() => process.exit(1));
});
