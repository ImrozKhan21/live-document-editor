const User = require('./user.mongo');
const getUsers = async () => {
    return User.find({}, {'__v': 0}, {lean: true});
}
const getUser = async (googleId) => {
    return User.findById(googleId, {'__v': 0}, {lean: true});
}
const createUser = async ({ username, email, photo, googleId }) => {
    // Since I have added uniqueness to email field in the schema, I don't need to check if the user already exists
 /*   const existingUser = await User.findOne({ email: email }, {'_id': 0, '__v': 0}, {lean: true});
    if (existingUser) {
        throw new Error('User with this email already exists.');
        // Or return null; depending on how you want to handle this case
        // return null;
    }*/
    try {
        // Attempt to create a new user
        const newUser = new User({ username, email, photo, googleId });
        await newUser.save();
        return newUser;
    } catch (error) {
        // Handle duplicate key error or other errors
        return User.findOne({email: email}, {'_id': 0, '__v': 0}, {lean: true});
       // throw error; // Rethrow if it's not a duplicate key error
    }
}

module.exports = {
    getUsers, getUser, createUser
}