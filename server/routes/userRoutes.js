const express = require("express");
const userRouter = express.Router();

const {
  registerUser,
  loginUser,
  getUserById,
  getUserResume,
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect , getUserById);

userRouter.get("/resumes", protect, getUserResume);

module.exports = userRouter;
