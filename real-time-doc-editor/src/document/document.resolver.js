const {getDocuments, getDocument, createDocument, updateDocument, deleteDocument, shareDocument} = require("./document.model");
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
};

module.exports = documentResolvers;