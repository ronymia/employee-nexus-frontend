import { gql } from "@apollo/client";

export const OWNER_DASHBOARD = gql`
  query OwnerDashboard {
    ownerDashboard {
      success
      statusCode
      message
      data {
        businessOverview {
          totalEmployees
          activeEmployees
          inactiveEmployees
          totalDepartments
          totalProjects
          activeProjects
          totalMonthlyPayroll
          pendingPayrollAmount
        }
        attendanceAnalytics {
          today {
            present
            absent
            late
            onLeave
            notPunchedIn
          }
          thisWeek {
            averageAttendanceRate
            totalWorkingDays
            totalPresentDays
          }
          thisMonth {
            attendanceRate
            lateArrivals
            earlyDepartures
          }
          trend {
            date
            presentCount
          }
        }
        leaveStats {
          pending
          approved
          rejected
          thisMonth {
            total
            byType {
              leaveType
              count
            }
          }
          upcomingLeaves {
            employeeName
            leaveType
            startDate
            endDate
          }
        }
        payrollSummary {
          currentCycle {
            name
            status
            periodStart
            periodEnd
            paymentDate
            totalEmployees
            totalGrossPay
            totalDeductions
            totalNetPay
          }
          yearToDate {
            totalPaid
            averageMonthlyPayroll
            highestMonth {
              month
              amount
            }
            lowestMonth {
              month
              amount
            }
          }
          pendingActions {
            draftCycles
            pendingApprovals
            pendingPayments
          }
        }
        projectOverview {
          total
          active
          completed
          onHold
          recentProjects {
            name
            status
            memberCount
            startDate
            endDate
          }
        }
        recentActivities {
          unreadNotifications
          recentActivities {
            type
            message
            timestamp
          }
        }
      }
    }
  }
`;

export const EMPLOYEE_DASHBOARD = gql`
  query EmployeeDashboard {
    employeeDashboard {
      success
      statusCode
      message
      data {
        personalInfo {
          fullName
          employeeId
          department
          designation
          joiningDate
          email
          phone
        }
        attendanceSummary {
          today {
            status
            checkInTime
            checkOutTime
            workingHours
          }
          thisMonth {
            totalPresent
            totalAbsent
            totalLate
            attendanceRate
          }
          recentAttendance {
            date
            status
            checkInTime
            checkOutTime
          }
        }
        leaveSummary {
          availableLeaves {
            leaveType
            total
            used
            remaining
          }
          upcomingLeaves {
            leaveType
            startDate
            endDate
            status
          }
          leaveHistory {
            leaveType
            startDate
            endDate
            status
            reason
          }
        }
        payrollSummary {
          currentMonth {
            grossPay
            totalDeductions
            netPay
            status
          }
          lastPayment {
            month
            grossPay
            netPay
            paidDate
          }
          yearToDate {
            totalGrossPay
            totalDeductions
            totalNetPay
          }
        }
        taskOverview {
          assigned
          inProgress
          completed
          overdue
          recentTasks {
            title
            project
            status
            dueDate
            priority
          }
        }
        notifications {
          unread
          recent {
            type
            message
            timestamp
            isRead
          }
        }
      }
    }
  }
`;
