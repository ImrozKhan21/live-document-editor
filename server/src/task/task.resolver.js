const {getTasks, createTask, getTask, updateTask, deleteTask} = require("./task.model");

const taskResolvers = {
    Query: {
        tasks: async () => {
            return await getTasks();
        },
        task: async (_, { id }) => {
            return await getTask(id);
        },
    },
    Mutation: {
        createTask: async (_, { title, description, status, assigneeId }) => {
            return await createTask({ title, description, status, assigneeId });
        },
        updateTask: async (_, updatedTask) => {
            return await updateTask(updatedTask)
        },
        deleteTask: async (_, { id }) => {
            return await deleteTask(id)
        },
    },
};

module.exports = taskResolvers;