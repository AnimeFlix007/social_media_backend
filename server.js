const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const DbConnect = require("./config/DbConnect");
const errorMiddleware = require("./middleware/error");
const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
require("dotenv").config();

const PORT = 5000;

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({limit: '50mb'}));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.0.104:5173"],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use(errorMiddleware);

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
