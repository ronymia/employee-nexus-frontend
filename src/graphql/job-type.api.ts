import { gql } from "@apollo/client";

export const GET_JOB_TYPES = gql`
  query JobTypes {
    jobTypes {
      message
      statusCode
      success
      data {
        description
        id
        name
        status
      }
    }
  }
`;
export const CREATE_JOB_TYPES = gql`
  mutation CreateJobType($name: String!, $description: String!) {
    createJobType(
      createJobTypeInput: { name: $name, description: $description }
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
        status
        updatedAt
      }
    }
  }
`;
export const UPDATE_JOB_TYPES = gql`
  mutation UpdateJobType($id: Int!, $name: String!, $description: String) {
    updateJobType(
      updateJobTypeInput: { id: $id, name: $name, description: $description }
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
        status
        updatedAt
      }
    }
  }
`;
export const DELETE_JOB_TYPES = gql`
  mutation DeleteJobType($id: Int!) {
    deleteJobType(id: $id) {
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
        updatedAt
      }
    }
  }
`;
