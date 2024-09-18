const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content
  const refreshToken = cookies.refreshToken;

  try {
    // Verify and decode the JWT refreshToken
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Extract userId or email from the decoded token (e.g., `email`)
    const { email } = decoded;

    // Find the user in the database by `email`
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      // If no user found, clear the cookie and send 204
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV != "development",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV != "development",
      });
      return res.sendStatus(204); // No content
    }

    // Ensure the refresh token matches the one in the database
    if (foundUser.refreshToken !== refreshToken) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: process.env.NODE_ENV != "development",
      });
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV != "development",
      });
      return res.sendStatus(403); // Forbidden
    }

    // Clear the refreshToken in the database
    foundUser.refreshToken = "";
    await foundUser.save();

    // Clear the jwt cookie from the client
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV != "development",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV != "development",
    });
    res.sendStatus(204); // No content
  } catch (err) {
    console.error(err);
    res.sendStatus(403); // Forbidden or Token Invalid
  }
};

module.exports = { handleLogout };
