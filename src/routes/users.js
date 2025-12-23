const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

// Get all the pending connection requests for the authenticated user
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Logic to fetch pending connection requests for the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', "firstName lastName photoUrl gender about skills"); // populate fromUserId with user details
        res.json({
            message: 'Data fetched successfully!',
            data: connectionRequests
        });

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// Get all the sent connection requests by the authenticated user
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Logic to fetch sent connection requests by the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ],
        }).populate('fromUserId toUserId', "firstName lastName photoUrl gender about skills");

        const data = connectionRequests.map(request => {
            // Determine the connected user
            const connectedUser = request.fromUserId._id.toString() === loggedInUser._id.toString()
                ? request.toUserId
                : request.fromUserId;
            return connectedUser;
        });

        res.json({
            message: 'Connections fetched successfully!',
            data: data
        });

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = userRouter;    