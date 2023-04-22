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

const userDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    return res.status(200).json({ user });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    return res.status(200).json({ user });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

module.exports = { searchUser, userDetail, updateUser };
