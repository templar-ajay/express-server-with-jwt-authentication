const mongoose = require("mongoose");
const { isDevelopmentEnv } = require("../config/variables");
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

if (isDevelopmentEnv) {
  User.recompileSchema();
  User.syncIndexes();
}

module.exports = User;
