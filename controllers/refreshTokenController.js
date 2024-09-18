const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { addCookieToResponse } = require("../utils/cookies");
const ms = require("ms");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refreshToken || req.body.refreshToken || false;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  try {
    // Verify and decode the refreshToken
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden if invalid token

        // Find the user from the email in the decoded token
        const foundUser = await User.findOne({ email: decoded.email }).exec();
        if (!foundUser) return res.sendStatus(403); // Forbidden if no user found

        // Check if the refresh token matches the user's token
        if (foundUser.refreshToken !== refreshToken) {
          return res.sendStatus(403); // Forbidden if token doesn't match
        }

        // Generate a new access token
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_DURATION }
        );

        // Optionally set a new cookie with the access token
        addCookieToResponse({
          res,
          name: "accessToken",
          value: accessToken,
          age: ms(process.env.ACCESS_TOKEN_DURATION),
        });

        res.json({ success: true, accessToken });
      }
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal Server Error
  }
};

module.exports = { handleRefreshToken };
