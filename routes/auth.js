const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.post("/", authController.handleLogin);

module.exports = authRouter;
