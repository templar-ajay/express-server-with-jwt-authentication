const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { addCookieToResponse } = require("../utils/cookies");
const ms = require("ms");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  // if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  // const token = authHeader.split(" ")[1];
  const accessToken = req.cookies?.accessToken;
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // try to refresh the token
      const refreshToken = req.cookies?.refreshToken;
      return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return res.sendStatus(403); // Forbidden if invalid token
          }
          try {
            // refresh the accessToken
            // Find the user from the email in the decoded token
            const foundUser = await User.findOne({
              email: decoded.email,
            }).exec();
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

            // set a new cookie with the access token
            addCookieToResponse({
              res,
              name: "accessToken",
              value: accessToken,
              age: ms(process.env.ACCESS_TOKEN_DURATION),
            });
            req.user = decoded.email;
            req.roles = roles;
            next();
          } catch (err) {
            console.error("error refreshing the tokens", err);
            res.sendStatus(500); // Internal Server Error
          }
        }
      );
    }
    req.user = decoded.UserInfo.email;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
