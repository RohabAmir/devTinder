const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validationSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


app.use(express.json()) // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Route to handle user sign-up
app.post('/signUp', async (req, res) => {
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
app.post('/login', async (req, res) => {
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


// get profile api ( by adding userAuth middleware we are protecting this route )
app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// Get user by email API
app.get('/user', async (req, res) => {
    const emailId = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send('User fetched successfully');
    } catch (error) {
        res.status(500).send("Server error: " + error.message);
    }
});

// Feed Api -> /Get all users From the database
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send("Users fetched successfully");
    } catch (error) {
        res.status(500).send("Server error: " + error.message);
    }
});

// Delete User Api
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const result = await User.deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Server error: " + error.message);
    }
});

// Update User Api ( Patch request )
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"]
        const isAllowedUpdate = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        if (!isAllowedUpdate) {
            throw new Error('Update not allowed');
        }
        if (data?.skills.length > 10) {
            throw new Error('Skills cannot be more than 10');
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        }
        );
        console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Error updating user: " + error.message);
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

