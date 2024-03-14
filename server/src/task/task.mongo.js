const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Task = model('Task', taskSchema);
module.exports = Task;
