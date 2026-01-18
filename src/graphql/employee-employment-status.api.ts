import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  mutation ($assignEmployeeStatusInput: AssignEmployeeStatusInput!) {
    assignEmployeeStatus(
      assignEmployeeStatusInput: $assignEmployeeStatusInput
    ) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        employmentStatus {
          name
          description
        }
        startDate
        endDate
        isActive
        reason
        remarks
      }
    }
  }
`;

export const GET_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  query EmploymentStatusHistory($userId: Int!) {
    employmentStatusHistory(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        startDate
        endDate
        isActive
        reason
        remarks
        employmentStatus {
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

export const GET_ACTIVE_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  query GetActiveEmploymentStatus($userId: Int!) {
    getActiveEmploymentStatus(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        isActive
        reason
        remarks
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
        employmentStatus {
          id
          name
          description
          status
        }
      }
    }
  }
`;

export const GET_EMPLOYEE_EMPLOYMENT_STATUS_BY_ID = gql`
  query GetEmploymentStatusById($userId: Int!, $employmentStatusId: Int!) {
    getEmploymentStatusById(
      userId: $userId
      employmentStatusId: $employmentStatusId
    ) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        isActive
        reason
        remarks
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
        employmentStatus {
          id
          name
          description
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  mutation UpdateEmployeeStatus(
    $updateEmployeeStatusInput: UpdateEmployeeStatusInput!
  ) {
    updateEmployeeStatusInput(
      updateEmployeeStatusInput: $updateEmployeeStatusInput
    ) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        isActive
        reason
        remarks
        startDate
        endDate
        employmentStatus {
          id
          name
        }
      }
    }
  }
`;
