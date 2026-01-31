import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_DEPARTMENT = gql`
  mutation ($assignEmployeeDepartmentInput: AssignEmployeeDepartmentInput!) {
    assignEmployeeDepartment(
      assignEmployeeDepartmentInput: $assignEmployeeDepartmentInput
    ) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        department {
          name
          description
        }
        employee {
          employeeId
          user {
            email
            profile {
              fullName
            }
          }
        }
        startDate
        endDate
        isPrimary
        isActive
        roleInDept
        remarks
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_EMPLOYEE_DEPARTMENT = gql`
  query DepartmentHistory($userId: Int!) {
    departmentHistory(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        startDate
        endDate
        isPrimary
        isActive
        roleInDept
        remarks
        department {
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

export const GET_ACTIVE_EMPLOYEE_DEPARTMENT = gql`
  query GetActiveDepartment($userId: Int!) {
    getActiveDepartment(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        isPrimary
        isActive
        roleInDept
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
        department {
          id
          name
          description
        }
      }
    }
  }
`;

export const GET_EMPLOYEE_DEPARTMENT_BY_ID = gql`
  query GetDepartmentById($userId: Int!, $departmentId: Int!) {
    getDepartmentById(userId: $userId, departmentId: $departmentId) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        isPrimary
        isActive
        roleInDept
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
        department {
          id
          name
          description
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_DEPARTMENT = gql`
  mutation UpdateEmployeeDepartment(
    $updateEmployeeDepartmentInput: UpdateEmployeeDepartmentInput!
  ) {
    updateEmployeeDepartment(
      updateEmployeeDepartmentInput: $updateEmployeeDepartmentInput
    ) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        isPrimary
        isActive
        roleInDept
        startDate
        endDate
        department {
          id
          name
        }
      }
    }
  }
`;
