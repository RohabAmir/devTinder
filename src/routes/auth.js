const express = require('express');
const authRouter = express.Router();

const User = require('../models/user');
const { validationSignUpData } = require('../utils/validation');


// Route to handle user sign-up
authRouter.post('/signup', async (req, res) => {
    try {
        //Validation of data
        validationSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypting password before saving to database
        const hashedPassword = await User.encryptPassword(password);

        // Creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });
        await user.save();
        res.send("User created successfully!");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// Route to handle user login 
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("User not found with email: " + emailId);
        }

        const isPasswordMatch = await user.validatePassword(password);
        if (isPasswordMatch) {
            // Create a JWT Token
            const token = await user.getJWTToken();
            // Add the token to cookie and send the response back to the client
            res.cookie('authToken', token);
            res.send("Login successful!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

//Route to handle user logout
authRouter.post('/logout', (req, res) => {
    try {
        res.clearCookie('authToken');
        res.send("Logout successful!");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});


module.exports = authRouter;