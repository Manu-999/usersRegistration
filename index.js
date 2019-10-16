const express = require('express');
const app = express();
const router = require('express').Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect DB

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log('DB connection established!')
);

// Middlewares

app.use(express.json());

// Importing Routes

const authRoute = require('./routes/auth');

// Routes Middlewares

app.use('/user', authRoute);

// Server

const PORT = 3000 || process.env.PORT;

app.listen(PORT, console.log(`Server running on ${PORT}`));
