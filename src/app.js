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
        if(data?.skills.length > 10){
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

