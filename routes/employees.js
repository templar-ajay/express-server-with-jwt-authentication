const express = require("express");
const employeesRouter = express.Router();
const employeesController = require("../controllers/employeesController");

employeesRouter.get("/", employeesController.getAllEmployees);

module.exports = employeesRouter;
