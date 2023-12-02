const APIError = require("../error/api_err");
const CustomError = require("../error/CustomError");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomError || err instanceof APIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({ msg: "There was an error!" });
};
module.exports = errorHandlerMiddleware;
