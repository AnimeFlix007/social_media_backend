const User = require("../model/User");
const ErrorHandler = require("../utils/errorHandler");

const searchUser = async (req, res, next) => {
  try {
    const { username } = req.query;
    const users = await User.find({ username: { $regex: username } })
      .limit(10)
      .select("username avatar fullname");

    return res.status(200).json({ users });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

module.exports = { searchUser };
