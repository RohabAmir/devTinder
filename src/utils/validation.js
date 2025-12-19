const validator = require('validator');

const validationSignUpData = (req) => {
    const { firstName, lastName, emailId, password, } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First name and Last name are required");
    }
    if (emailId && !validator.isEmail(emailId)) {
        throw new Error("Invalid email address: " + emailId);
    }
    if (password && !validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
}

const validationEditProfileData = (req) => {
    const allowedEditFields = [
    'firstName', 
    'lastName', 
    'photoUrl', 
    'age', 
    'gender', 
    'about', 
    'skills'
];
    const requestedEditFields = Object.keys(req.body);
    const isEditAllowed = requestedEditFields.every((field) => allowedEditFields.includes(field));
   return isEditAllowed;

}

module.exports = {
    validationSignUpData,
    validationEditProfileData
};