const Task = require('./task.mongo');
const getTasks = async () => {
    return Task.find({}, {'__v': 0}, {lean: true});
}
const getTask = async (id) => {
    return Task.findById(id, {'__v': 0}, {lean: true});
}
const createTask = async ({ title, description, status, assigneeId }) => {
    const newTask = new Task({ title, description, status, user: assigneeId });
    await newTask.save();
    return Task.findById(newTask._id).populate('user');
}

const updateTask = async (updatedTask) => {
    const {id} = updatedTask;
    return Task.findOneAndUpdate({_id: id}, updatedTask, {new: true, runValidators: true}).populate('user');
}

const deleteTask = async (id) => {
    try {
        const deletedTask =  Task.findByIdAndDelete(id, {lean: true});
        if (!deletedTask) {
            throw new Error('Task not found');
        }
        return deletedTask; // Or return a success message/indicator
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error; // Rethrow or handle error appropriately
    }
}


module.exports = {
    getTasks, getTask, createTask, updateTask, deleteTask
}