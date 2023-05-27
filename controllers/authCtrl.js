const User = require("../model/User");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;
    const isUsernameExists = await User.findOne({ username });
    if (isUsernameExists)
      return next(new ErrorHandler("Username Already Exists", 409));

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists)
      return next(new ErrorHandler("Email Already Exists", 409));
    if (password.length < 6)
      return next(
        new ErrorHandler("Password should be more than 6 characters", 403)
      );

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Register Success!",
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler());
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isUserExists = await User.findOne({ email });
    if (!isUserExists)
      return next(new ErrorHandler("User does not Exists", 401));
    const isMatch = await bcrypt.compare(password, isUserExists.password);
    if (!isMatch) return next(new ErrorHandler("Incorrect Password", 401));

    const access_token = createAccessToken({ id: isUserExists._id });
    const refresh_token = createRefreshToken({ id: isUserExists._id });

    return res.status(200).json({
      message: "Login Success!",
      access_token,
      refresh_token,
      user: {
        ...isUserExists._doc,
        password: "",
      },
    });
  } catch (error) {
    return next(new ErrorHandler());
  }
};

const generateAccessToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshtoken;
    if (!refresh_token) return next(new ErrorHandler("Unauthorized", 401));
    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_KEY,
      async (err, result) => {
        if (err) return next(new ErrorHandler("Please Login", 500));
        const user = await User.findById(result.id)
          .select("-password")
          .populate("followers following", "-password");

        if (!user) return next(new ErrorHandler("User does not exists", 409));

        const access_token = createAccessToken({ id: user._id });

        return res.status(200).json({ user, access_token });
      }
    );
  } catch (error) {
    return next(new ErrorHandler());
  }
};

module.exports = {
  register,
  login,
  generateAccessToken
};
