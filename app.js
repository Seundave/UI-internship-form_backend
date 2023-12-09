const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/index");
const errorHandler = require("./middleware/error");


const app = express();

// set permission for domain that can connect to the database
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(mongoSanitize("dev"));
}

app.use("/", routes);
app.use(errorHandler);


module.exports = app;