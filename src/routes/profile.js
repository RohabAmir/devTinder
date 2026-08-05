const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validationEditProfileData } = require('../utils/validation');


// get profile apis
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json({
            message: 'Profile data fetched successfully!',
            data: user
        });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validationEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;

        const requestedEditFields = Object.keys(req.body);
        requestedEditFields.forEach((field) => {
            loggedInUser[field] = req.body[field];
        });

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your Profile updated successfully!`,
            data: loggedInUser
        });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch('/profile/forgot-password', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { newPassword } = req.body;

        if (!newPassword) {
            throw new Error("New password is required");
        }

        // Encrypting the new password before saving to database
        const hashedPassword = await loggedInUser.encryptPassword(newPassword);
        loggedInUser.password = hashedPassword;

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your password has been updated successfully!`,
            data: loggedInUser
        });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});


module.exports = profileRouter;