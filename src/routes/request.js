const express = require('express');
const requestRouter = express.Router();
const mongoose = require('mongoose');

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

// Send Connection Request Api
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value: " + status });
        }

        //validate toUserId format before querying the database
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid toUserId format" });
        }

        // Check if user is not present in the database
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "The user you are trying to connect with does not exist." });
        }

        // Check if a connection request already exists between these users
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists between these users." });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: 'Connection request sent successfully!',
            data: data
        })

    } catch (error) {
        console.error("Error sending connection request:", error);
        res.status(400).send("ERROR : " + error.message);
    }
});

// Review Connection Request Api
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params

        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value: " + status });
        }

        // Find the connection request by ID
        const connectionRequest = await ConnectionRequest.findOne({ 
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found." });
        }

        // Update the status of the connection request
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: 'Connection request reviewed successfully!',
            data: data
        });

    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = requestRouter;