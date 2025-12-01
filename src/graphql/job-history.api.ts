import { gql } from "@apollo/client";

export const GET_JOB_HISTORY_BY_USER_ID = gql`
  query GetJobHistoryByUserId($userId: Int!) {
    jobHistoryByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        jobTitle
        companyName
        employmentType
        country
        city
        startDate
        endDate
        responsibilities
        achievements
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_JOB_HISTORY = gql`
  mutation CreateJobHistory($createJobHistoryInput: CreateJobHistoryInput!) {
    createJobHistory(createJobHistoryInput: $createJobHistoryInput) {
      success
      statusCode
      message
      data {
        id
        userId
        jobTitle
        companyName
        employmentType
        country
        city
        startDate
        endDate
        responsibilities
        achievements
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_JOB_HISTORY = gql`
  mutation UpdateJobHistory($updateJobHistoryInput: UpdateJobHistoryInput!) {
    updateJobHistory(updateJobHistoryInput: $updateJobHistoryInput) {
      success
      statusCode
      message
      data {
        id
        userId
        jobTitle
        companyName
        employmentType
        country
        city
        startDate
        endDate
        responsibilities
        achievements
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_JOB_HISTORY = gql`
  mutation DeleteJobHistory($id: Int!, $userId: Int!) {
    deleteJobHistory(id: $id, userId: $userId) {
      success
      statusCode
      message
    }
  }
`;
