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
        payrollItemComponents {
          id
          value
          componentType
          calculationType
          calculatedAmount
          payrollItemId
          payrollComponentId
          payrollComponent {
            id
            name
            code
            componentType
            calculationType
            isTaxable
          }
        }
        payslipAdjustments {
          id
          payrollItemId
          value
          payrollComponentId
          appliedMonth
          status
          notes
          reviewedAt
          payrollComponent {
            id
            name
            code
            componentType
            calculationType
            isTaxable
          }
        }
        user {
          id
          email
          profile {
            fullName
            # avatar
          }
          role {
            id
            name
          }
          employee {
            userId
            employeeId
            nidNumber
            joiningDate
            designation {
              id
              name
            }
            employmentStatus {
              id
              name
            }
            department {
              id
              name
            }
            # workSite {
            #   id
            #   name
            # }
            workSchedule {
              id
              name
            }
            createdAt
            updatedAt
          }
          business {
            address
            city
            createdAt
            email
            id
            name
            phone
            country
            postcode
            registrationDate
            status
            updatedAt
            website
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
        overtimeMinutes
        status
        paymentMethod
        bankAccount
        transactionRef
        paidAt
        notes
        # payrollComponents {
        #   id
        #   payrollItemId
        #   componentId
        #   component {
        #     id
        #     name
        #     code
        #     componentType
        #   }
        #   amount
        #   calculationBase
        #   notes
        # }
        # adjustments {
        #   id
        #   payrollItemId
        #   type
        #   description
        #   amount
        #   isRecurring
        #   createdBy
        #   notes
        #   payrollComponent {
        #     name
        #     code
        #     componentType
        #     calculationType
        #   }
        # }
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
        overtimeMinutes
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
          payrollComponent {
            name
            code
            componentType
            calculationType
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// CREATE PAYROLL ITEM
export const CREATE_PAYROLL_ITEM = gql`
  mutation CreatePayrollItem($userId: Int!, $payrollCycleId: Int!) {
    createPayrollItem(userId: $userId, payrollCycleId: $payrollCycleId) {
      message
      statusCode
      success
      data {
        payrollCycleId
        userId
        basicSalary
        grossPay
        totalDeductions
        netPay
        workingDays
        presentDays
        absentDays
        leaveDays
        overtimeMinutes
        payrollComponents {
          payrollComponentId
          value
          effectiveFrom
          effectiveTo
          assignedBy
          payrollComponent {
            name
            code
            componentType
            calculationType
          }
          notes
        }
        payrollAdjustments {
          value
          payrollComponent {
            name
            code
            componentType
            calculationType
          }
        }
      }
    }
  }
`;

// UPDATE PAYROLL ITEM
export const UPDATE_PAYROLL_ITEM = gql`
  mutation UpdatePayrollItem($updatePayrollItemInput: UpdatePayrollItemInput!) {
    updatePayrollItem(updatePayrollItemInput: $updatePayrollItemInput) {
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
      # data {
      #   id
      #   status
      # }
    }
  }
`;

// MARK PAYROLL ITEM AS PAID
export const MARK_PAYROLL_ITEM_PAID = gql`
  mutation MarkPayrollItemAsPaid(
    $payrollItemAsPaidInput: PayrollItemAsPaidInput!
  ) {
    markPayrollItemAsPaid(payrollItemAsPaidInput: $payrollItemAsPaidInput) {
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

// PREVIEW PAYROLL ITEM
export const PREVIEW_PAYROLL_ITEM = gql`
  mutation PreviewPayrollItem($userId: Int!, $payrollCycleId: Int!) {
    previewPayrollItem(userId: $userId, payrollCycleId: $payrollCycleId) {
      message
      statusCode
      success
      data {
        payrollCycleId
        userId
        basicSalary
        grossPay
        totalDeductions
        netPay
        workingDays
        presentDays
        absentDays
        leaveDays
        overtimeMinutes
        payrollComponents {
          userId
          payrollComponentId
          value
          effectiveFrom
          effectiveTo
          assignedBy
          assignedByUser {
            id
            email
            profile {
              fullName
            }
          }
          payrollComponent {
            name
            code
            componentType
            calculationType
          }
          notes
        }
        payrollAdjustments {
          value
          remarks
          status
          requestedBy
          reviewedBy
          reviewedAt
          requestedByUser {
            id
            email
            profile {
              fullName
            }
          }
          reviewedByUser {
            id
            email
            profile {
              fullName
            }
          }
          payrollComponent {
            name
            code
            componentType
            calculationType
          }
        }
      }
    }
  }
`;
