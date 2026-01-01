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
  query ($getEmployeeDepartmentsInput: GetEmployeeDepartmentsInput!) {
    getEmployeeDepartments(
      getEmployeeDepartmentsInput: $getEmployeeDepartmentsInput
    ) {
      success
      statusCode
      message
      data {
        userId
        departmentId
        department {
          name
          manager {
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
      }
    }
  }
`;
