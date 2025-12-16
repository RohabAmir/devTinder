const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://devTinder:Sherlock%406969@devtinder.cofkk9b.mongodb.net/devTinder');
}

module.exports = connectDB;

