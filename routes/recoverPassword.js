const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Reset password

router
  .get('/reset', (req, res) => {
    res.render('recoverPassword.ejs');
  })
  .post('/reset', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
      const url = `http://localhost:3000/user/reset/password?token=${token}`;
      res
        .status(200)
        .header('auth-token', token)
        .send(url);
    } else {
      res.status(400).send('Email not found!');
    }
  });

// Reset link

router
  .get(`/reset/password`, (req, res) => {
    const tokenUrl = req.query.token;

    try {
      const verified = jwt.verify(tokenUrl, process.env.TOKEN_SECRET);
      console.log(verified);
      res.render('resetPassword.ejs');
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  })
  .post('/reset/password', async (req, res) => {
    const tokenUrl = req.headers['auth-token'];
    console.log(tokenUrl);

    try {
      const verified = jwt.verify(tokenUrl, process.env.TOKEN_SECRET);
      console.log(verified.id);
      const userUpdate = await User.findOneAndUpdate({ password: newpassword });
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  });

module.exports = router;
