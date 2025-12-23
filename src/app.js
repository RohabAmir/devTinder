const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json()) // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Importing Routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/users');

// Using Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// Connecting to Database and starting the server
connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log(`Server is successfully running on port 3000`);
    });
})
    .catch((err) => {
        console.error('Database connection failed');
    });

