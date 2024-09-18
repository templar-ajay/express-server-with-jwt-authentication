// controllers/userController.js
const Employee = require("../models/Employee");

const seedEmployees = async () => {
  const users = [
    {
      firstname: "Dave",
      lastname: "Gray",
    },
    {
      firstname: "John",
      lastname: "Smith",
    },
  ];

  try {
    // Clear the collection first (optional)
    await Employee.deleteMany({});

    // Insert users into the database
    await Employee.insertMany(users);

    console.log("Users added successfully");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

module.exports = { seedEmployees };
