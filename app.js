const express = require("express");
const rateLimit = require("express-rate-limit");
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
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(mongoSanitize("dev"));
}

// const limiter = rateLimit({
//   max: 3000,
//   windowMs: 60 * 60 * 1000, //send up to 3000 requests
//   message: "Too many requests from this IP, Please try again in an hour",
// });




// app.use("/api", limiter);
app.use("/", routes);
app.use(errorHandler);


module.exports = app;