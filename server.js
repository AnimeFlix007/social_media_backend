const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const DbConnect = require("./config/DbConnect");
require("dotenv").config();

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res, next) => {
  return res.json({ msg: "Hello" });
});

DbConnect()
  .then(({ connection }) => {
    console.log(`${connection.host}`);
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running on Port 5000");
    });
  })
  .catch(() => {
    console.log("Internal Server Error");
  });
