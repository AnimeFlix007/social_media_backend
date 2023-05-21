const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "30d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: "30d" });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};