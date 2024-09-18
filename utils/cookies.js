function addCookieToResponse({ res, name, value, age }) {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV != "development",
    maxAge: age,
  });
}
module.exports = { addCookieToResponse };
