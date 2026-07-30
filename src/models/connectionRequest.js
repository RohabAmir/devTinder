const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // reference to User model
            required: true,

        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // reference to User model
            required: true,

        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['ignored', 'interested', 'accepted', 'rejected'],
                message: 'This value of status is not supported'
            },
        },
    }, {
    timestamps: true
}
);

//Making a compound index for optimizing the query for finding connection requests between two users.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', async function () {
    // check if the fromUserId and toUserId are the same
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        throw new Error("You cannot send a connection request to yourself.");
    }
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);