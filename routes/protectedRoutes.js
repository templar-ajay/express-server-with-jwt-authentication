const express = require("express");
const protectedRouter = express.Router();

const employeesRouter = require("./employees");

protectedRouter.use("/employees", employeesRouter);

module.exports = protectedRouter;
