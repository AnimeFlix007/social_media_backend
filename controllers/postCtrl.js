const Post = require("../model/Post");
const ErrorHandler = require("../utils/errorHandler");

const createPost = async (req, res, next) => {
  const { content, images } = req.body;
  try {
    if (images.length === 0)
      return next(new ErrorHandler("Please Add images", 403));

    const newPost = await Post.create({
      content,
      images,
      user: req.user._id,
    });

    return res.json({
      message: "Created Post!",
      post: newPost,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message));
  }
};

const getAllPosts = async (req, res, next) => {
  const userId = req.user._id;
  const page = req.query.page || 1;
  const limit = 16;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({})
      .skip(skip)
      .limit(limit)
      .populate("user")
      // .select("-password");
    const likes = posts.map((post) =>
      post.likes.find((user) => user._id.toString() == userId.toString())
        ? true
        : false
    );
    const saved = posts.map((post) =>
      req.user.saved.find((postId) => postId.toString() == post._id.toString())
        ? true
        : false
    );
    const results = await Post.count();
    return res.json({ results, posts, likes, saved });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

const getAllImages = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const posts = await Post.find({ user: userId });
    const images = posts.map((post) => post.images);
    return res.json({ images: images.flat() });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const getAllUserPosts = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const posts = await Post.find({ user: userId })
      .populate("user likes")
      .select("-password");
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
    return res.json({ posts, likes, saved });
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

const likePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Invalid Post", 402));
    const isLiked = post.likes.find((user) => user == userId.toString());
    if (isLiked) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "removed Liked from Post", liked: false });
    } else {
      await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );
      return res.status(200).json({ message: "Liked Post", liked: true });
    }
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const discover = async (req, res, next) => {
  try {
    const newArr = [...req.user.following, req.user._id];

    const num = req.query.num || 10;

    let posts = await Post.aggregate([
      { $match: { user: { $in: newArr } } },
      { $sample: { size: Number(num) } },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "likes",
      //     foreignField: "_id",
      //     as: "likes",
      //   },
      // },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    posts = posts.slice(0, 8);

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

    return res.json({
      likes,
      posts: posts.map((post) => {
        return {
          ...post,
          user: post.user[0],
        };
      }),
      saved,
    });
  } catch (err) {
    return next(new ErrorHandler());
  }
};

const recommendedPosts = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const posts = await Post.find({})
      .populate("user likes")
      .select("-password");

    const length = posts.length;

    const recommended = [];

    while (recommended.length <= 3) {
      let random = Math.floor(Math.random() * length) - 1;
      if (random < length && random >= 0) {
        recommended.push(posts[random]);
      }
    }
    const likes = recommended.map((post) =>
      post.likes.find((user) => user._id.toString() == userId.toString())
        ? true
        : false
    );
    const saved = recommended.map((post) =>
      req.user.saved.find((postId) => postId.toString() == post._id.toString())
        ? true
        : false
    );
    return res.json({ recommended, likes, saved });
  } catch (error) {
    return next(new ErrorHandler(error.message));
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getAllImages,
  getAllUserPosts,
  likePost,
  discover,
  recommendedPosts,
};
