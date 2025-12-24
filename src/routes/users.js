const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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

// Feed Api -> Gets you the profiles of the other users on the application
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1; // Default to page 1
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 50) limit = 50; // Max limit of 50
        const skip = (page - 1) * limit;

        // Get all connection requests ( send + recieved ) involving the logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId status');

        //1. Extract user IDs that are already connected or have pending requests
        const hiderUserIds = new Set();
        connectionRequests.forEach(request => {
            hiderUserIds.add(request.fromUserId.toString());
            hiderUserIds.add(request.toUserId.toString());
        });

        //2. Fetch users excluding those in hiderUserIds and also exculding self
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiderUserIds) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select('firstName lastName photoUrl gender about skills')
            .skip(skip)
            .limit(limit);

        res.json({
            data: users
        });

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});





module.exports = userRouter;    