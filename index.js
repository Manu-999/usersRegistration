const express = require('express');
const app = express();

// Importing Routes

const authRoute = require('./routes/auth');

// Routes Middlewares

app.use('/user', authRoute);

const PORT = 3000 || process.env.PORT;

app.listen(PORT, console.log(`Server running on ${PORT}`));
