const mongoose = require("mongoose");
const { isDevelopmentEnv } = require("./variables");
const { seedEmployees } = require("../controllers/seedEmployees");
require("colors");

console.log("isDevelopmentEnvironment".bgBlue, `${isDevelopmentEnv}`.bgBlue);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URI);
    console.log(
      "Connected to MongoDB: ",
      connection.connection.host.bgMagenta.underline
    );
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB };
