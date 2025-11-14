import { gql } from "@apollo/client";

export const GET_RECRUITMENT_PROCESSES = gql`
  query RecruitmentProcesses {
    recruitmentProcesses {
      message
      statusCode
      success
      data {
        description
        id
        name
        isRequired
        status
      }
    }
  }
`;
export const CREATE_RECRUITMENT_PROCESSES = gql`
  mutation CreateRecruitmentProcess(
    $name: String!
    $description: String!
    $isRequired: Boolean!
  ) {
    createRecruitmentProcess(
      createRecruitmentProcessInput: {
        name: $name
        description: $description
        isRequired: $isRequired
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        isRequired
        name
        status
        updatedAt
      }
    }
  }
`;
export const UPDATE_RECRUITMENT_PROCESSES = gql`
  mutation UpdateRecruitmentProcess(
    $id: Int!
    $name: String!
    $isRequired: Boolean!
    $description: String!
  ) {
    updateRecruitmentProcess(
      updateRecruitmentProcessInput: {
        id: $id
        name: $name
        description: $description
        isRequired: $isRequired
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        name
        isRequired
        status
        updatedAt
      }
    }
  }
`;
export const DELETE_RECRUITMENT_PROCESSES = gql`
  mutation DeleteRecruitmentProcess($id: Int!) {
    deleteRecruitmentProcess(id: $id) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        name
        status
        isRequired
        updatedAt
      }
    }
  }
`;
