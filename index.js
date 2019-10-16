const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect DB

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('DB connection established!')
);

// Statics
app.set('vew engine', 'ejs');

// Middlewares

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

// Importing Routes

const homeRoute = require('./routes/index');
const authRoute = require('./routes/auth');

// Routes Middlewares

app.use('/', homeRoute);

app.use('/user', authRoute);

// Server

const PORT = 3000 || process.env.PORT;

app.listen(PORT, console.log(`Server running on ${PORT}`));
