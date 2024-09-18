const express = require("express");
const unprotectedRouter = express.Router();
const path = require("path");
const authRouter = require("./auth");
const logoutRouter = require("./logout");
const refreshRouter = require("./refresh");
const registerRouter = require("./register");

unprotectedRouter.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

unprotectedRouter.use("/login", authRouter);
unprotectedRouter.use("/logout", logoutRouter);
unprotectedRouter.use("/refresh", refreshRouter);
unprotectedRouter.use("/register", registerRouter);

module.exports = unprotectedRouter;
