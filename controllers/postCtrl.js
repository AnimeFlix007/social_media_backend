const ErrorHandler = require("../utils/errorHandler")

const createPost = async (req, res, next) => {
    try {
        return res.json({msg: "success"})
    } catch (error) {
        return next(new ErrorHandler())
    }
}

const getAllPosts = async (req, res, next) => {
    try {
        return res.json({msg: "success"})
    } catch (error) {
        return next(new ErrorHandler())
    }
}

const getPost = async (req, res, next) => {
    try {
        return res.json({msg: "success"})
    } catch (error) {
        return next(new ErrorHandler())
    }
}

module.exports = {createPost, getAllPosts, getPost}