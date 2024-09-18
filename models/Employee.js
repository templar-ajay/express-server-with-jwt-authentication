const mongoose = require("mongoose");
const { isDevelopmentEnv } = require("../config/variables");
const Schema = mongoose.Schema;

const employeesSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeesSchema);

if (isDevelopmentEnv) {
  Employee.recompileSchema();
  Employee.syncIndexes();
}

module.exports = Employee;
