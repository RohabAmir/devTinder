const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validationEditProfileData } = require('../utils/validation');


// get profile api ( by adding userAuth middleware we are protecting this route )
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
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


module.exports = profileRouter;