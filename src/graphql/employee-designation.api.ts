import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_DESIGNATION = gql`
  mutation ($assignEmployeeDesignationInput: AssignEmployeeDesignationInput!) {
    assignEmployeeDesignation(
      assignEmployeeDesignationInput: $assignEmployeeDesignationInput
    ) {
      message
      statusCode
      success
      data {
        userId
        designationId
        startDate
        endDate
        isActive
      }
    }
  }
`;

export const GET_EMPLOYEE_DESIGNATION = gql`
  query DesignationHistory($userId: Int!) {
    designationHistory(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        designationId
        startDate
        endDate
        isActive
        remarks
        designation {
          id
          name
          description
          status
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ACTIVE_EMPLOYEE_DESIGNATION = gql`
  query GetActiveDesignation($userId: Int!) {
    getActiveDesignation(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        designationId
        isActive
        startDate
        endDate
        employee {
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
        }
        designation {
          id
          name
          description
        }
      }
    }
  }
`;

export const GET_EMPLOYEE_DESIGNATION_BY_ID = gql`
  query GetDesignationById($userId: Int!, $designationId: Int!) {
    getDesignationById(userId: $userId, designationId: $designationId) {
      success
      statusCode
      message
      data {
        userId
        designationId
        salary
        isActive
        startDate
        endDate
        employee {
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
        }
        designation {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_DESIGNATION = gql`
  mutation UpdateEmployeeDesignation(
    $updateEmployeeDesignationInput: UpdateEmployeeDesignationInput!
  ) {
    updateEmployeeDesignation(
      updateEmployeeDesignationInput: $updateEmployeeDesignationInput
    ) {
      success
      statusCode
      message
      data {
        userId
        designationId
        salary
        isActive
        startDate
        endDate
        designation {
          id
          name
        }
      }
    }
  }
`;
