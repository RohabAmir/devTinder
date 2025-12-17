const moongose = require('mongoose');

const userSchema = new moongose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
    },
    password: {
        type: String,
    },  
    age: {
        type: Number,
    }, 
    gender: {
        type: String,
    },
});

module.exports = moongose.model('User', userSchema);
