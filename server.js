const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const DbConnect = require("./config/DbConnect");
const errorMiddleware = require("./middleware/error");
require("dotenv").config();

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", require("./router/authRouter"))

app.use(errorMiddleware)

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
