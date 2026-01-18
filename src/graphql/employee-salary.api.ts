import { gql } from "@apollo/client";

export const GET_EMPLOYEE_SALARY = gql`
  query SalaryHistory($userId: Int!) {
    salaryHistory(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        salaryAmount
        salaryType
        startDate
        endDate
        isActive
        reason
        remarks
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ACTIVE_EMPLOYEE_SALARY = gql`
  query ActiveSalaryByUserId($userId: Int!) {
    activeSalaryByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        userId
        salaryAmount
        salaryType
        startDate
        endDate
        isActive
        reason
        remarks
      }
    }
  }
`;

export const GET_EMPLOYEE_SALARY_BY_ID = gql`
  query SalaryById($id: Int!) {
    salaryById(id: $id) {
      success
      statusCode
      message
      data {
        id
        userId
        salaryAmount
        salaryType
        startDate
        endDate
        isActive
        reason
        remarks
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_SALARY_BY_ID = gql`
  mutation UpdateSalary(
    $updateEmployeeSalaryInput: UpdateEmployeeSalaryInput!
  ) {
    updateSalary(updateEmployeeSalaryInput: $updateEmployeeSalaryInput) {
      success
      statusCode
      message
      data {
        id
        userId
        salaryAmount
        salaryType
        startDate
        endDate
        isActive
        reason
        remarks
      }
    }
  }
`;

export const ASSIGN_EMPLOYEE_SALARY = gql`
  mutation CreateSalary(
    $createEmployeeSalaryInput: CreateEmployeeSalaryInput!
  ) {
    createSalary(createEmployeeSalaryInput: $createEmployeeSalaryInput) {
      success
      statusCode
      message
      data {
        id
        userId
        salaryAmount
        salaryType
        startDate
        endDate
        isActive
        reason
        remarks
        createdAt
        updatedAt
      }
    }
  }
`;
