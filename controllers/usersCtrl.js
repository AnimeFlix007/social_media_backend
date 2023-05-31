const Post = require("../model/Post");
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
      .populate("followers following close_friends");
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    return res.status(200).json({ user });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const loggedInUserDetails = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id)
      .select("-password")
      .populate("followers following close_friends saved");
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    return res.status(200).json({ user });
  } catch (error) {
    return next(new ErrorHandler(error.message));
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

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return next(new ErrorHandler("User does not exists", 404));
    return res.status(200).json({ message: "Profile Deleted Sucsessfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
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

const savePost = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Invalid Post", 404));
    const isSaved = req.user.saved.find((post) => post.toString() == postId);
    if (isSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: postId } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Post Removed From Save", saved: false });
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { saved: postId } },
        { new: true }
      );
      return res.status(200).json({ message: "Post Saved", saved: true });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const getUserSavePosts = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("saved");
    const posts = user.saved;
    const likes = posts.map((post) =>
      post.likes.find((user) => user._id.toString() == req.user._id.toString())
        ? true
        : false
    );

    const saved = posts.map((post) =>
      req.user.saved.find((postId) => postId.toString() == post._id.toString())
        ? true
        : false
    );
    return res.status(200).json({ savedPosts: posts, likes, saved });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const suggestedUsers = async (req, res) => {
  try {
    const newArr = [...req.user.following, req.user._id];

    const num = req.query.num || 5;

    const users = await User.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "following",
        },
      },
    ]).project("-password");

    return res.json({
      users,
      result: users.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const closeFriend = async (req, res, next) => {
  const loginUserId = req.user._id;
  const friendId = req.params.friendId;
  try {
    const targetUser = await User.findById(friendId);
    if (!targetUser) {
      return next(new ErrorHandler("User does not exists", 405));
    }
    const isFollowed = req.user.following.find(
      (userId) => userId.toString() == friendId.toString()
    );
    if (!isFollowed) {
      return next(
        new ErrorHandler(
          "Please Follow this user to add in your close friend list",
          405
        )
      );
    }
    const isCloseFriend = req.user.close_friends.find(
      (userId) => userId.toString() == friendId.toString()
    );
    if (isCloseFriend) {
      await User.findByIdAndUpdate(loginUserId, {
        $pull: { close_friends: friendId },
      });
      return res.json({
        message: `${targetUser.username} removed From Close Friend`,
        closefriend: false,
      });
    } else {
      await User.findByIdAndUpdate(loginUserId, {
        $push: { close_friends: friendId },
      });
      return res.json({
        message: `${targetUser.username} added to Close Friend`,
        closefriend: true,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const getUserCloseFriends = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate("close_friends");
    return res.status(200).json({ close_friends: user.close_friends });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

module.exports = {
  searchUser,
  userDetail,
  loggedInUserDetails,
  getAllUsers,
  updateUser,
  deleteUser,
  followUser,
  unfollow,
  suggestedUsers,
  savePost,
  closeFriend,
  getUserSavePosts,
  getUserCloseFriends,
};
