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
        components {
          id
          amount
          calculationBase
          component {
            name
            componentType
            calculationType
          }
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
          createdAt
          updatedAt
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
        payrollCycleId
        userId
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
            id
            userId
            employeeId
            nidNumber
            joiningDate
            salaryPerMonth
            workingDaysPerWeek
            workingHoursPerWeek
            designationId
            designation {
              id
              name
            }
            employmentStatusId
            employmentStatus {
              id
              name
            }
            departmentId
            department {
              id
              name
            }
            workSiteId
            workSite {
              id
              name
            }
            workScheduleId
            workSchedule {
              id
              name
            }
            rotaType
            createdAt
            updatedAt
          }
          business {
            address
            city
            createdAt
            email
            id
            lat
            lng
            name
            numberOfEmployeesAllowed
            phone
            country
            postcode
            registrationDate
            status
            subscriptionPlanId
            updatedAt
            userId
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
