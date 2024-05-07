const DocumentModel = require('./document.mongo');
const {sendEventToUpdateDocument} = require("../kafka-service/document-update.kafka");
const {sendEventToShareDocumentEmail} = require("../kafka-service/share-document.kafka");
const User = require("../user/user.mongo");

const getDocuments = async (user) => {
    const userDetails = await User.findOne({ email: user.email });
    const userId = userDetails._id; // Assuming you find the user
    return DocumentModel.find({
        $or: [
            { owner: userId },
            { sharedWith: user.email }
        ]
    }, {'__v': 0}, {lean: false}).populate('owner').populate('history.updatedBy')
}
const getDocument = async (id, user) => {
    const currentDocument = DocumentModel.findById(id, {'__v': 0}, {lean: true}).populate('owner');
    if (currentDocument.owner.email === user.email || currentDocument.sharedWith.includes(user.email)) {
        return document;
    } else {
        throw new Error('Unauthorized access');
    }
}

const createDocument = async ({title, content, ownerId}) => {
    const newDocument = new DocumentModel({title, content, owner: ownerId});
    await newDocument.save();
    // so that owner is populated in the response as we only save ownerId in DB for document
    return DocumentModel.findById(newDocument._id).populate('owner');
}

const updateDocument = async (updatedDoc, documentNameSpace) => {
    const updatedByEmail = updatedDoc.email;
    const user = await User.findOne({ email: updatedByEmail }).exec();
    const userId = user?._id;
    const documentUpdates = {...updatedDoc, userId: userId};
    await sendEventToUpdateDocument({updatedDoc: documentUpdates, documentNameSpace});
    return {...updatedDoc, _id: updatedDoc.id, processing: true};
}

// TODO: In future don't delete the document, just mark it as deleted
const deleteDocument = async (id) => {
    try {
        const deletedDocument =  DocumentModel.findByIdAndDelete(id, {lean: true});
        if (!deletedDocument) {
            throw new Error('Document not found');
        }
        return deletedDocument; // Or return a success message/indicator
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error; // Rethrow or handle error appropriately
    }
}

const shareDocument = async ({id, ownerEmails}, documentNameSpace) => {
    await sendEventToShareDocumentEmail({id, ownerEmails, documentNameSpace});
    return {_id: id, processing: true};
}

const getUpdatedBy = async (historyEntry, args, context) => {
    if (!historyEntry.updatedBy) {
        return null;  // Return null if no user ID is set
    }
    return User.findById(historyEntry.updatedBy);
}

module.exports = {
    getDocument, getDocuments, createDocument, updateDocument, deleteDocument, shareDocument, getUpdatedBy
}