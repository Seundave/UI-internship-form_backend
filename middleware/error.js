const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    const validationErrors = errors.join(". ");
    error = new ErrorResponse(validationErrors, 400);
  }

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Server Error",
  });
};

module.exports = errorHandler;
