const express = require("express");
const refreshRouter = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

refreshRouter.post("/", refreshTokenController.handleRefreshToken);

module.exports = refreshRouter;
