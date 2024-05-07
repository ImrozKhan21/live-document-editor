const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const documentSchema = new Schema({
    content: {type: String, required: false},
    title: {type: String, required: true},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    sharedWith: [{type: String, required: false}],
});

documentSchema.add({
    history: [{
        content: {type: String, required: false},
        updatedAt: { type: Date, default: Date.now },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        _id: false
    }]
});

const DocumentModel = model('Document', documentSchema);
module.exports = DocumentModel;
