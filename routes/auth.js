const router = require('express').Router();
const User = require('../models/User');
const { registerValidation } = require('../validation');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if a user is already registered

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send('This email has been already registered!');

  // Checking if username is already registered

  const userNameExist = await User.findOne({ username: req.body.username });
  if (userNameExist)
    return res.status(400).send('This username is already taken!');

  // Hashing the password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Creating a new User

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
