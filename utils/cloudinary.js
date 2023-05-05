const cloudinary = require("cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = (file, folder) => {
  return new Promise((res, rej) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        res(result.url);
      },
      { resourse_type: "auto", folder }
    );
  });
};

module.exports = uploadCloudinary