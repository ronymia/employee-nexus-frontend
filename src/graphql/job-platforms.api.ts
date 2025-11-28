import { gql } from "@apollo/client";

export const GET_JOB_PLATFORMS = gql`
  query JobPlatforms {
    jobPlatforms {
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
export const CREATE_JOB_PLATFORMS = gql`
  mutation CreateJobPlatform($name: String!, $description: String!) {
    createJobPlatform(
      createJobPlatformInput: { name: $name, description: $description }
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
export const UPDATE_JOB_PLATFORMS = gql`
  mutation UpdateJobPlatform($id: Int!, $name: String!, $description: String) {
    updateJobPlatform(
      updateJobPlatformInput: {
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
export const DELETE_JOB_PLATFORMS = gql`
  mutation DeleteJobPlatform($id: Int!) {
    deleteJobPlatform(id: $id) {
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
