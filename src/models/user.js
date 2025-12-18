const moongose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');

const userSchema = new moongose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18,

    },
    gender: {
        type: String,
        validate(value) {
            const allowedGenders = ['male', 'female', 'other'];
            if (!allowedGenders.includes(value.toLowerCase())) {
                throw new Error('Gender must be male, female, or other');
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://www.example.com/default-photo.jpg',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo Url: " + value);
            }
        }
    },
    about: {
        type: String,
        default: 'This is the default about of the user',
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true
    }

);

userSchema.methods.getJWTToken = async function () {
    const user = this;
    const token = await jwt.sign({ userId: this._id }, 'DevTinder@6969', {
        expiresIn: '7d'
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bycrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;

}
// static encrypt so you can call User.encryptPassword
userSchema.statics.encryptPassword = async function (plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bycrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

module.exports = moongose.model('User', userSchema);
