const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  try {
    // Check for duplicate emails in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict

    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create and store the new user (make sure to instantiate User model)
    const newUser = new User({
      email: email,
      roles: { User: 2001 },
      password: hashedPwd,
    });

    // Save the new user to the database
    const result = await newUser.save();
    // console.log(result);

    res.status(201).json({ success: `New user with email: ${email} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
