const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');


// Example protected route ( by adding userAuth middleware we are protecting this route )
requestRouter.post('/requests', userAuth, async (req, res) => {
    try {
        const user = req.user;
        // Logic to fetch requests for the authenticated user
        res.send(`Requests for user: ${user.firstName} ${user.lastName}`);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = requestRouter;