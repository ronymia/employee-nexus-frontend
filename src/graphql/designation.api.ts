import { gql } from "@apollo/client";

export const GET_DESIGNATIONS = gql`
  query Designations {
    designations {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
export const CREATE_DESIGNATION = gql`
  mutation CreateDesignation($name: String!, $description: String!) {
    createDesignation(
      createDesignationInput: { name: $name, description: $description }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
export const UPDATE_DESIGNATION = gql`
  mutation UpdateDesignation($id: Int!, $name: String!, $description: String!) {
    updateDesignation(
      updateDesignationInput: {
        id: $id
        name: $name
        description: $description
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
export const DELETE_DESIGNATION = gql`
  mutation DeleteDesignation($id: Int!) {
    deleteDesignation(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        status
        description
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
