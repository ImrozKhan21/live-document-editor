import { gql } from 'apollo-angular';

export const GET_DOCUMENTS = gql`
  {
    documents {
      _id
      content
      owner {
        email
        _id
        username
      }
      title
      sharedWith
      history {
        content
        updatedAt
        updatedBy {
          email
        }
      }
    }
  }
`;
