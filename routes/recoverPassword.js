const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const userId = [];

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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pruebasmanueldev@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: 'pruebasmanueldev@gmail.com',
        to: req.body.email,
        subject: 'Recover your password',
        text: url
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).send('Email sent');
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
      // console.log(verified.id);
      userId.push(verified.id);
      res.render('resetPassword.ejs');
    } catch (error) {
      res.status(400).send('Invalid token');
      console.log(error);
    }
  })
  .post('/reset/password', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);

    const userExist = await User.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );
    if (!userExist) {
      res.status(400).send('Invalid update');
    } else {
      res.status(200).send('Password updated!');
    }
  });

module.exports = router;
