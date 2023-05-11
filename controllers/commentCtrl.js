const Comment = require("../model/Comment");
const ErrorHandler = require("../utils/errorHandler");

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate(
      "user",
      "avatar username"
    );
    return res.status(200).json({ comments: comments.reverse() });
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      postId: req.params.postId,
      user: req.user._id,
    });
    return res.status(200).json({ comment, message: "New Comment Added" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content,
      },
      { new: true }
    );
    return res.status(200).json({ comment, message: "Comment Updated" });
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({ message: "Comment Deleted" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
};
