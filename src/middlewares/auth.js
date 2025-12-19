const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        //Read the token from cookies
        const token = req.cookies.authToken;
        if (!token) {
            throw new Error("Authentication token not found");
        }
        // Verify the token
        const decoded = await jwt.verify(token, 'DevTinder@6969');
        const userId = decoded.userId;
        // Find the user associated with the token
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
};

module.exports = {
    userAuth
} 