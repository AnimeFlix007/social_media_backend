const mongoose = require("mongoose");

const DbConnect = () => {
  return mongoose.connect(process.env.MONGODB_URI);
};

module.exports = DbConnect;
