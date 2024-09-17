const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong mongo id error
  if (err.name == "CastError") {
    const message = `Resources not found with this id Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate Key Error
  if (err.code == 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate Key Error
  if (err.name == "JsonWebTokenError") {
    const message = `Invalid Url PLease Try Again Later`;
    err = new ErrorHandler(message, 400);
  }

  //Invalid JWT Error
  if (err.name == "JsonWebTokenError") {
    const message = `Invalid Url PLease Try Again Later`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Expired
  if (err.name == "TokenExpired") {
    const message = `Your url is expired Try Again Later`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
