const User = require("../model/User");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(new ErrorHandler("Unaauthorized User"));
    if (token.startsWith("Bearer")) {
      const access_token = token.split(" ")[1];
      const decode = jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY);
      const user = await User.findById(decode.id);
      if (!user) return next(new ErrorHandler("Invalid User", 401));
      req.user = user;
      next();
    } else {
      return next(new ErrorHandler("Invalid Token", 401));
    }
  } catch (error) {
    return next(new ErrorHandler("Token Expired", 401));
  }
};

module.exports = auth;
