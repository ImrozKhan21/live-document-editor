const {getUsers, getUser, createUser} = require("./user.model");

const userResolvers = {
    Query: {
        users: async () => {
            return await getUsers();
        },
        user: async (_, { id, email, googleId }) => {
            return await getUser(googleId);
        },
    },
    Mutation: {
        createUser: async (_, { username, email, googleId, photo }) => {
            return await createUser({ username, email, googleId, photo });
        },
        updateUser: async (_, { id, username, email }) => {
            // Logic to update an existing user in your database
        },
        deleteUser: async (_, { id }) => {
            // Logic to delete a user from your database
        },
    },
};

module.exports = userResolvers;