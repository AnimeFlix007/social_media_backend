const Post = require("../model/Post");
const uploadCloudinary = require("../utils/cloudinary");
const ErrorHandler = require("../utils/errorHandler");
const fs = require("fs");

const createPost = async (req, res, next) => {
  const uploader = async (path) => await uploadCloudinary(path, "images");
  const files = req.files;
  try {
    const urls = [];
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const { content } = req.body;

    if (urls.length === 0)
      return next(new ErrorHandler("Please Add images", 403));

    const newPost = await Post.create({
      content,
      images: urls,
      user: req.user._id,
    });

    return res.json({
      message: "Created Post!",
      post: newPost,
    });
  } catch (err) {
    return next(new ErrorHandler());
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("user");
    return res.json({ posts });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate("user");
    return res.json({ post });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const updatePost = async (req, res, next) => {
  const id = req.params.id;
  const { content, images } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { content, images },
      { new: true }
    ).populate("user");
    return res.status(200).json({ message: "Post updated Successfully", post });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted Successfully" });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

module.exports = { createPost, getAllPosts, getPost, updatePost, deletePost };
