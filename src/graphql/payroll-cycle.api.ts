import { gql } from "@apollo/client";

// GET ALL PAYROLL CYCLES
export const GET_PAYROLL_CYCLES = gql`
  query PayrollCycles($query: QueryPayrollCycleInput) {
    payrollCycles(query: $query) {
      message
      statusCode
      success
      data {
        id
        name
        frequency
        periodStart
        periodEnd
        paymentDate
        status
        totalGrossPay
        totalDeductions
        totalNetPay
        totalEmployees
        approvedBy
        approvedAt
        processedBy
        processedAt
        notes
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

// GET PAYROLL CYCLE BY ID
export const GET_PAYROLL_CYCLE_BY_ID = gql`
  query PayrollCycleById($id: Int!) {
    payrollCycleById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        frequency
        periodStart
        periodEnd
        paymentDate
        status
        totalGrossPay
        totalDeductions
        totalNetPay
        totalEmployees
        approvedBy
        approvedAt
        processedBy
        processedAt
        notes
        businessId
        payrollItems {
          id
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
          basicSalary
          grossPay
          totalDeductions
          netPay
          status
          components {
            # componentItems
            amount
            calculationBase
            notes
          }
          adjustments {
            type
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// CREATE PAYROLL CYCLE
export const CREATE_PAYROLL_CYCLE = gql`
  mutation CreatePayrollCycle(
    $createPayrollCycleInput: CreatePayrollCycleInput!
  ) {
    createPayrollCycle(createPayrollCycleInput: $createPayrollCycleInput) {
      message
      statusCode
      success
      data {
        id
        name
        frequency
        periodStart
        periodEnd
        paymentDate
        status
        createdAt
      }
    }
  }
`;

// UPDATE PAYROLL CYCLE
export const UPDATE_PAYROLL_CYCLE = gql`
  mutation UpdatePayrollCycle(
    $id: Int!
    $updatePayrollCycleInput: UpdatePayrollCycleInput!
  ) {
    updatePayrollCycle(
      id: $id
      updatePayrollCycleInput: $updatePayrollCycleInput
    ) {
      message
      statusCode
      success
      data {
        id
        name
        status
        updatedAt
      }
    }
  }
`;

// DELETE PAYROLL CYCLE
export const DELETE_PAYROLL_CYCLE = gql`
  mutation DeletePayrollCycle($id: Int!) {
    deletePayrollCycle(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// APPROVE PAYROLL CYCLE
export const APPROVE_PAYROLL_CYCLE = gql`
  mutation ApprovePayrollCycle(
    $approvePayrollCycleInput: ApprovePayrollCycleInput!
  ) {
    approvePayrollCycle(approvePayrollCycleInput: $approvePayrollCycleInput) {
      message
      statusCode
      success
      data {
        id
        status
        approvedBy
        approvedAt
      }
    }
  }
`;

// PROCESS PAYROLL CYCLE
export const PROCESS_PAYROLL_CYCLE = gql`
  mutation ProcessPayrollCycle(
    $processPayrollCycleInput: ProcessPayrollCycleInput!
  ) {
    processPayrollCycle(processPayrollCycleInput: $processPayrollCycleInput) {
      message
      statusCode
      success
      data {
        id
        status
        processedBy
        processedAt
        totalGrossPay
        totalDeductions
        totalNetPay
        totalEmployees
      }
    }
  }
`;
// FINALIZE PAYROLL CYCLE
