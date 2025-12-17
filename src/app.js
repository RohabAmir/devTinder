const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json()); // Middleware to parse JSON bodies

// Route to handle user sign-up
app.post('/signUp', async (req, res) => {

    //Creating a new instance of user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error creating user: " + error.message);
    }
});



connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log(`Server is successfully running on port 3000`);
    });
})
    .catch((err) => {
        console.error('Database connection failed');
    });

