import { gql } from "@apollo/client";

// GET ALL PAYROLL COMPONENTS
export const GET_PAYROLL_COMPONENTS = gql`
  query PayrollComponents($query: QueryPayrollComponentInput) {
    payrollComponents(query: $query) {
      message
      statusCode
      success
      data {
        id
        name
        businessId
        calculationType
        code
        componentType
        defaultValue
        description
        displayOrder
        status
        isStatutory
        isTaxable
        createdAt
        updatedAt
      }
    }
  }
`;

// GET PAYROLL COMPONENT BY ID
export const GET_PAYROLL_COMPONENT_BY_ID = gql`
  query PayrollComponentById($id: Int!) {
    payrollComponentById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        code
        description
        componentType
        calculationType
        defaultValue
        status
        isTaxable
        isStatutory
        displayOrder
        businessId
        business {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// CREATE PAYROLL COMPONENT
export const CREATE_PAYROLL_COMPONENT = gql`
  mutation CreatePayrollComponent(
    $createPayrollComponentInput: CreatePayrollComponentInput!
  ) {
    createPayrollComponent(
      createPayrollComponentInput: $createPayrollComponentInput
    ) {
      message
      statusCode
      success
      data {
        id
        name
        code
        componentType
        calculationType
        defaultValue
        status
        createdAt
      }
    }
  }
`;

// UPDATE PAYROLL COMPONENT
export const UPDATE_PAYROLL_COMPONENT = gql`
  mutation UpdatePayrollComponent(
    $updatePayrollComponentInput: UpdatePayrollComponentInput!
  ) {
    updatePayrollComponent(
      updatePayrollComponentInput: $updatePayrollComponentInput
    ) {
      message
      statusCode
      success
      data {
        id
        name
        code
        componentType
        updatedAt
      }
    }
  }
`;

// DELETE PAYROLL COMPONENT
export const DELETE_PAYROLL_COMPONENT = gql`
  mutation DeletePayrollComponent($id: Int!) {
    deletePayrollComponent(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// PAYROLL COMPONENT OVERVIEW
export const PAYROLL_COMPONENT_OVERVIEW = gql`
  query PayrollComponentOverview {
    payrollComponentOverview {
      success
      statusCode
      message
      data {
        total
        earning
        deduction
        fixedAmount
        percentageOfBasic
        active
        draft
        disabled
        taxable
        nonTaxable
        statutory
        nonStatutory
      }
    }
  }
`;
