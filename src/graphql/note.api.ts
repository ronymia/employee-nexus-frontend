import { gql } from "@apollo/client";

export const GET_NOTES_BY_USER_ID = gql`
  query GetNotesByUserId($userId: Int!) {
    notesByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        createdBy
        creator {
          id
          #   name
          email
        }
        title
        content
        category
        isPrivate
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($createNoteInput: CreateNoteInput!) {
    createNote(createNoteInput: $createNoteInput) {
      success
      statusCode
      message
      data {
        id
        userId
        createdBy
        creator {
          id
          #   name
          email
        }
        title
        content
        category
        isPrivate
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($updateNoteInput: UpdateNoteInput!) {
    updateNote(updateNoteInput: $updateNoteInput) {
      success
      statusCode
      message
      data {
        id
        userId
        createdBy
        creator {
          id
          #   name
          email
        }
        title
        content
        category
        isPrivate
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: Int!, $userId: Int!) {
    deleteNote(id: $id, userId: $userId) {
      success
      statusCode
      message
    }
  }
`;
