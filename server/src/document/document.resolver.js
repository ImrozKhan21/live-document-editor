const {getDocuments, getDocument, createDocument, updateDocument, deleteDocument, shareDocument, getUpdatedBy} = require("./document.model");
const documentResolvers = {
    Query: {
        documents: async (_,__, context) => {
            const {user} = context;
            return await getDocuments(user)
        },
        document: async (_, { id }, context) => {
            const {user} = context;
            return await getDocument(id);
        },
    },
    Mutation: {
        createDocument: async (_, { title, content, ownerId }) => {
            return await createDocument({ title, content, ownerId })
        },
        updateDocument: async (_, updatedDoc,  { documentNameSpace }) => {
            return await updateDocument(updatedDoc, documentNameSpace)
        },
        deleteDocument: async (_, { id }) => {
            return await deleteDocument(id)
        },
        shareDocument: async (_, {id, ownerEmails},  { documentNameSpace }) => {
            return await shareDocument({id, ownerEmails}, documentNameSpace)
        },
    },
    Document: {
        history: (document) => {
            return document.history || {};
        },
    },
    DocumentHistory: { // because we want to support nullable updatedBy object,
        // otherwise it throws error for mandatory fields in User
        updatedBy: async (historyEntry, args, context) => {
           return await getUpdatedBy(historyEntry, args, context);
        }
    }
};

module.exports = documentResolvers;