import { gql } from "@apollo/client";

// GET ALL PAYROLL ITEMS
export const GET_PAYROLL_ITEMS = gql`
  query PayrollItems($query: QueryPayrollItemInput!) {
    payrollItems(query: $query) {
      message
      statusCode
      success
      data {
        id
        payrollCycleId
        userId
        user {
          id
          email
          profile {
            fullName
            # avatar
          }
        }
        basicSalary
        grossPay
        totalDeductions
        netPay
        workingDays
        presentDays
        absentDays
        leaveDays
        overtimeHours
        status
        paymentMethod
        bankAccount
        transactionRef
        paidAt
        notes
        components {
          id
          payrollItemId
          componentId
          component {
            id
            name
            code
            componentType
          }
          amount
          calculationBase
          notes
        }
        adjustments {
          id
          payrollItemId
          type
          description
          amount
          isRecurring
          createdBy
          notes
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// GET PAYROLL ITEM BY ID
export const GET_PAYROLL_ITEM_BY_ID = gql`
  query PayrollItemById($id: Int!) {
    payrollItemById(id: $id) {
      message
      statusCode
      success
      data {
        id
        payrollCycleId
        payrollCycle {
          id
          name
          frequency
          periodStart
          periodEnd
          paymentDate
        }
        userId
        user {
          id
          email
          profile {
            fullName
            avatar
          }
        }
        basicSalary
        grossPay
        totalDeductions
        netPay
        workingDays
        presentDays
        absentDays
        leaveDays
        overtimeHours
        status
        paymentMethod
        bankAccount
        transactionRef
        paidAt
        notes
        components {
          id
          componentId
          component {
            id
            name
            code
            componentType
            calculationType
          }
          amount
          calculationBase
          notes
        }
        adjustments {
          id
          type
          description
          amount
          isRecurring
          createdBy
          notes
          createdAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// CREATE PAYROLL ITEM
export const CREATE_PAYROLL_ITEM = gql`
  mutation CreatePayrollItem($createPayrollItemInput: CreatePayrollItemInput!) {
    createPayrollItem(createPayrollItemInput: $createPayrollItemInput) {
      message
      statusCode
      success
      data {
        id
        # payrollCycleId
        # userId
        # basicSalary
        # grossPay
        # totalDeductions
        # netPay
        status
        # createdAt
      }
    }
  }
`;

// UPDATE PAYROLL ITEM
export const UPDATE_PAYROLL_ITEM = gql`
  mutation UpdatePayrollItem(
    $id: Int!
    $updatePayrollItemInput: UpdatePayrollItemInput!
  ) {
    updatePayrollItem(
      id: $id
      updatePayrollItemInput: $updatePayrollItemInput
    ) {
      message
      statusCode
      success
      data {
        id
        status
        grossPay
        totalDeductions
        netPay
        updatedAt
      }
    }
  }
`;

// DELETE PAYROLL ITEM
export const DELETE_PAYROLL_ITEM = gql`
  mutation DeletePayrollItem($id: Int!) {
    deletePayrollItem(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// APPROVE PAYROLL ITEM
export const APPROVE_PAYROLL_ITEM = gql`
  mutation ApprovePayrollItem($id: Int!) {
    approvePayrollItem(id: $id) {
      message
      statusCode
      success
      data {
        id
        status
      }
    }
  }
`;

// MARK PAYROLL ITEM AS PAID
export const MARK_PAYROLL_ITEM_PAID = gql`
  mutation MarkPayrollItemAsPaid(
    $id: Int!
    $paymentMethod: String!
    $transactionRef: String!
  ) {
    markPayrollItemAsPaid(
      id: $id
      paymentMethod: $paymentMethod
      transactionRef: $transactionRef
    ) {
      message
      statusCode
      success
      data {
        id
        status
        transactionRef
        paidAt
      }
    }
  }
`;
