const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    photo: { type: String, required: false },
    googleId: {type: Number, required: false}
});

const User = model('User', userSchema);
module.exports = User;
