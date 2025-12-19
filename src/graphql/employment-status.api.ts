import { gql } from "@apollo/client";

export const GET_EMPLOYMENT_STATUSES = gql`
  query EmploymentStatuses {
    employmentStatuses {
      message
      statusCode
      success
      data {
        businessId
        id
        name
        status
        description
        createdAt
        updatedAt
      }
    }
  }
`;
export const CREATE_EMPLOYMENT_STATUS = gql`
  mutation CreateEmploymentStatus($name: String!, $description: String!) {
    createEmploymentStatus(
      createEmploymentStatusInput: { name: $name, description: $description }
    ) {
      message
      statusCode
      success
      data {
        businessId
        id
        name
        status
        description
        createdAt
        updatedAt
      }
    }
  }
`;
export const UPDATE_EMPLOYMENT_STATUS = gql`
  mutation UpdateEmploymentStatus(
    $id: Int!
    $name: String!
    $description: String!
  ) {
    updateEmploymentStatus(
      updateEmploymentStatusInput: {
        id: $id
        name: $name
        description: $description
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        id
        name
        status
        description
        createdAt
        updatedAt
      }
    }
  }
`;
export const DELETE_EMPLOYMENT_STATUS = gql`
  mutation DeleteEmploymentStatus($id: Int!) {
    deleteEmploymentStatus(id: $id) {
      message
      statusCode
      success
      data {
        businessId
        id
        name
        status
        description
        createdAt
        updatedAt
      }
    }
  }
`;
