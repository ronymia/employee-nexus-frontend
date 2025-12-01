import { gql } from "@apollo/client";

export const GET_EDUCATION_HISTORY_BY_USER_ID = gql`
  query GetEducationHistoryByUserId($userId: Int!) {
    educationHistoryByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        degree
        fieldOfStudy
        institution
        country
        city
        startDate
        endDate
        isCurrentlyStudying
        grade
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_EDUCATION_HISTORY = gql`
  mutation CreateEducationHistory(
    $createEducationHistoryInput: CreateEducationHistoryInput!
  ) {
    createEducationHistory(
      createEducationHistoryInput: $createEducationHistoryInput
    ) {
      success
      statusCode
      message
      data {
        id
        userId
        degree
        fieldOfStudy
        institution
        country
        city
        startDate
        endDate
        isCurrentlyStudying
        grade
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_EDUCATION_HISTORY = gql`
  mutation UpdateEducationHistory(
    $updateEducationHistoryInput: UpdateEducationHistoryInput!
  ) {
    updateEducationHistory(
      updateEducationHistoryInput: $updateEducationHistoryInput
    ) {
      success
      statusCode
      message
      data {
        id
        userId
        degree
        fieldOfStudy
        institution
        country
        city
        startDate
        endDate
        isCurrentlyStudying
        grade
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_EDUCATION_HISTORY = gql`
  mutation DeleteEducationHistory($id: Int!, $userId: Int!) {
    deleteEducationHistory(id: $id, userId: $userId) {
      success
      statusCode
      message
    }
  }
`;
