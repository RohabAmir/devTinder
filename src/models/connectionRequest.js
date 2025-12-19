const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        requireqed: true,

    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        requireqed: true,

    },
    status: {
        type: String,
        requireqed: true,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not supported'
        },
        default: 'pending'
    },
}, {
    timestamps: true

});



module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);