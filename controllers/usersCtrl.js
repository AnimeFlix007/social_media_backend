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
    const user = await User.findById(id)
      .select("-password")
      .populate("followers following");
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
    return res
      .status(200)
      .json({ user, message: "Profile Updated Sucsessfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const followUser = async (req, res, next) => {
  const loginUserId = req.user._id;
  const { followId } = req.body;

  try {
    const targetUser = await User.findById(followId);
    const alreadyFollowing = targetUser.followers.find((userId) => {
      return userId.toString() === loginUserId.toString();
    });
    if (alreadyFollowing) {
      return next(new ErrorHandler("already followed", 405));
    }
    await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: loginUserId },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      loginUserId,
      {
        $push: { following: followId },
      },
      { new: true }
    );
    res.json({ message: "Followed successfully" });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const unfollow = async (req, res, next) => {
  const loginUserId = req.user._id;
  const unfollowId = req.body.unfollowId;
  try {
    const targetUser = await User.findById(unfollowId);
    const isUnfollowed = targetUser.followers.find(
      (userId) => userId.toString() == loginUserId.toString()
    );
    if (!isUnfollowed) {
      return next(new ErrorHandler("already unfollowed", 405));
    }
    await User.findByIdAndUpdate(unfollowId, {
      $pull: { followers: loginUserId },
    });
    await User.findByIdAndUpdate(loginUserId, {
      $pull: { following: unfollowId },
    });
    return res.json({ message: `Unfollowed ${targetUser.username}` });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

module.exports = { searchUser, userDetail, updateUser, followUser, unfollow };
