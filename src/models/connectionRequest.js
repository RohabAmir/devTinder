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
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: 'This value of status is not supported'
        },
    },
}, {
    timestamps: true
}
);

connectionRequestSchema.pre('save', async function () {
    // check if the fromUserId and toUserId are the same
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    throw new Error("You cannot send a connection request to yourself.");
  }
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);