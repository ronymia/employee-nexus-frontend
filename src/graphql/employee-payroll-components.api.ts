import { gql } from "@apollo/client";

export const ASSIGN_PAYROLL_COMPONENT = gql`
  mutation AssignPayrollComponent(
    $assignEmployeePayrollComponentInput: AssignEmployeePayrollComponentInput!
  ) {
    assignEmployeePayrollComponent(
      assignEmployeePayrollComponentInput: $assignEmployeePayrollComponentInput
    ) {
      success
      statusCode
      message
      data {
        id
        userId
        payrollComponentId
        value
        # isActive
        effectiveFrom
        effectiveTo
        notes
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_PAYROLL_COMPONENT = gql`
  mutation UpdateEmployeePayrollComponent(
    $updateEmployeePayrollComponentInput: UpdateEmployeePayrollComponentInput!
  ) {
    updateEmployeePayrollComponent(
      updateEmployeePayrollComponentInput: $updateEmployeePayrollComponentInput
    ) {
      success
      statusCode
      message
      data {
        id
      }
    }
  }
`;

export const GET_EMPLOYEE_PAYROLL_COMPONENTS = gql`
  query EmployeePayrollComponents($query: QueryEmployeePayrollComponentInput) {
    employeePayrollComponents(query: $query) {
      success
      data {
        id
        userId
        payrollComponentId
        value
        # isActive
        effectiveFrom
        effectiveTo
        # isOverride
        notes
        payrollComponent {
          id
          name
          code
          componentType
          calculationType
          defaultValue
          status
          isTaxable
          isStatutory
          displayOrder
          businessId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_ACTIVE_EMPLOYEE_PAYROLL_COMPONENTS = gql`
  query ActiveEmployeePayrollComponents(
    $query: QueryEmployeePayrollComponentInput
  ) {
    activeEmployeePayrollComponents(query: $query) {
      success
      statusCode
      message
      data {
        id
        userId
        payrollComponentId
        value
        # isActive
        effectiveFrom
        effectiveTo
        # isOverride
        assignedBy
        notes
        createdAt
        updatedAt
        payrollComponent {
          id
          name
          code
          componentType
          calculationType
          defaultValue
          status
          isTaxable
          isStatutory
          displayOrder
          businessId
          createdAt
          updatedAt
        }
        assignedByUser {
          id
          email
          profile {
            fullName
          }
        }
      }
    }
  }
`;

export const EMPLOYEE_PAYROLL_COMPONENTS_HISTORY = gql`
  query EmployeePayrollComponentHistory(
    $query: QueryEmployeePayrollComponentInput
  ) {
    employeePayrollComponentHistory(query: $query) {
      success
      statusCode
      message
      data {
        id
        userId
        payrollComponentId
        value
        # isActive
        effectiveFrom
        effectiveTo
        # isOverride
        assignedBy
        notes
        createdAt
        updatedAt
        payrollComponent {
          id
          name
          code
          componentType
          calculationType
          defaultValue
          status
          isTaxable
          isStatutory
          displayOrder
          businessId
          createdAt
          updatedAt
        }
        assignedByUser {
          id
          email
          profile {
            fullName
          }
        }
      }
    }
  }
`;
export const DELETE_EMPLOYEE_PAYROLL_COMPONENT = gql`
  mutation DeleteEmployeePayrollComponent($id: Float!) {
    deleteEmployeePayrollComponent(id: $id) {
      success
      statusCode
      message
    }
  }
`;
