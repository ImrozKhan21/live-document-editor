import {gql} from "apollo-angular";

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($updateDocumentId: ID!, $title: String, $content: String, $email: String!) {
  updateDocument(id: $updateDocumentId, title: $title, content: $content, email: $email) {
    _id
    content
    title
  }
}
`;

export const SHARE_DOCUMENT = gql`
  mutation ShareDocument($updateDocumentId: ID!, $ownerEmails: [String!]!) {
    shareDocument(id: $updateDocumentId, ownerEmails: $ownerEmails) {
      _id
      owner {
        _id
        email
        username
      }
      title
    }
  }
`;
