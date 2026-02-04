import { gql } from "@apollo/client";

export const GET_MY_PAYSLIPS = gql`
  query GetMyPayslips($year: Int!) {
    payrollItemByUserId(year: $year) {
      data {
        id
        userId
        payrollCycleId
        basicSalary
        grossPay
        totalDeductions
        netPay
        status
        paymentMethod
        transactionRef
        paidAt
        createdAt
        user {
          id
          profile {
            fullName
          }
          employee {
            employeeId
            department {
              name
            }
            designation {
              name
            }
          }
        }
        payrollCycle {
          periodStart
          periodEnd
          paymentDate
        }
        payrollComponents {
          id
          value
          effectiveFrom
          effectiveTo
          notes
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
        payrollAdjustments {
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
      }
    }
  }
`;

export const GET_ALL_PAYSLIPS = gql`
  query PayrollItems($query: QueryPayrollItemInput!) {
    payrollItems(query: $query) {
      message
      statusCode
      success
      data {
        id
        userId
        payrollCycleId
        payrollCycle {
          id
          periodStart
          periodEnd
          paymentDate
          status
        }
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
            # workingDaysPerWeek
            # workingHoursPerWeek
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
            workSchedule {
              id
              name
            }
            employeePayrollComponents {
              id
              value
              effectiveFrom
              effectiveTo
              notes
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
            # employeePayslipAdjustments {
            #   id
            #   payrollItemId
            #   value
            #   payrollComponentId
            #   appliedMonth
            #   status
            #   notes
            #   reviewedAt
            #   payrollComponent {
            #     id
            #     name
            #     code
            #     componentType
            #     calculationType
            #     isTaxable
            #   }
            # }
            createdAt
            updatedAt
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
        createdAt
        updatedAt
      }
    }
  }
`;
