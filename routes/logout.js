const express = require("express");
const logoutRouter = express.Router();
const logoutController = require("../controllers/logoutController");

logoutRouter.get("/", logoutController.handleLogout);

module.exports = logoutRouter;
