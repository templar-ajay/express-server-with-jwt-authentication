const Employee = require("../models/Employee"); // Mongoose User model

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});

    res.json({
      success: true,
      message: "returned all employees successfully",
      data: employees,
    }); // Send access token as JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEmployees };
