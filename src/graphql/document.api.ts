import { gql } from "@apollo/client";

export const GET_DOCUMENTS_BY_USER_ID = gql`
  query GetDocumentsByUserId($userId: Int!) {
    documentsByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        title
        description
        attachment
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($createDocumentInput: CreateDocumentInput!) {
    createDocument(createDocumentInput: $createDocumentInput) {
      success
      statusCode
      message
      data {
        id
        userId
        title
        description
        attachment
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($updateDocumentInput: UpdateDocumentInput!) {
    updateDocument(updateDocumentInput: $updateDocumentInput) {
      success
      statusCode
      message
      data {
        id
        userId
        title
        description
        attachment
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: Int!, $userId: Int!) {
    deleteDocument(id: $id, userId: $userId) {
      success
      statusCode
      message
    }
  }
`;
