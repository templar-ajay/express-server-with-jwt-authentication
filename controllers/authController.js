const User = require("../models/User"); // Mongoose User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addCookieToResponse } = require("../utils/cookies");
const ms = require("ms");

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    // Find the user in MongoDB
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles); // Extract roles

      // Create JWTs (Access Token and Refresh Token)
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_DURATION } // Shorter expiration for access token
      );

      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_DURATION } // Longer expiration for refresh token
      );

      // Save the refreshToken to the database for the current user
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      // Send the refreshToken as an HttpOnly cookie and return the access token in the response
      addCookieToResponse({
        res,
        name: "refreshToken",
        value: refreshToken,
        age: ms(process.env.REFRESH_TOKEN_DURATION), // 1 day
      });

      addCookieToResponse({
        res,
        name: "accessToken",
        value: accessToken,
        age: ms(process.env.ACCESS_TOKEN_DURATION), // 60 seconds
      });

      res.json({
        success: true,
        message: "user " + email + "`logged in successfully",
      }); // Send access token as JSON
    } else {
      res.sendStatus(401); // Unauthorized if passwords don't match
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
