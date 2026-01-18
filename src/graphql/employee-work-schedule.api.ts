import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_WORK_SCHEDULE = gql`
  mutation ($assignEmployeeScheduleInput: AssignEmployeeScheduleInput!) {
    assignEmployeeSchedule(
      assignEmployeeScheduleInput: $assignEmployeeScheduleInput
    ) {
      success
      message
      data {
        workSchedule {
          name
        }
        assignedByUser {
          profile {
            fullName
          }
        }
        startDate
        notes
      }
    }
  }
`;

export const GET_EMPLOYEE_WORK_SCHEDULE = gql`
  query WorkScheduleHistory($userId: Int!) {
    workScheduleHistory(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        workScheduleId
        startDate
        endDate
        isActive
        assignedBy
        notes
        workSchedule {
          id
          name
          description
          scheduleType
          breakType
          breakMinutes
          schedules {
            id
            dayOfWeek
            isWeekend
            timeSlots {
              startTime
              endTime
            }
          }
        }
        assignedByUser {
          id
          email
          profile {
            fullName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ACTIVE_EMPLOYEE_WORK_SCHEDULE = gql`
  query GetActiveWorkSchedule($userId: Int!) {
    getActiveWorkSchedule(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        workScheduleId
        isActive
        assignedBy
        notes
        startDate
        endDate
        workSchedule {
          id
          name
          description
          scheduleType
          breakType
          breakMinutes
          schedules {
            dayOfWeek
            timeSlots {
              startTime
              endTime
            }
          }
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

export const GET_EMPLOYEE_WORK_SCHEDULE_BY_ID = gql`
  query GetWorkScheduleById($userId: Int!, $workScheduleId: Int!) {
    getWorkScheduleById(userId: $userId, workScheduleId: $workScheduleId) {
      success
      statusCode
      message
      data {
        userId
        workScheduleId
        isActive
        assignedBy
        notes
        startDate
        endDate
        user {
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
        }
        workSchedule {
          id
          name
          description
          schedules {
            id
            dayOfWeek
            timeSlots {
              id
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_WORK_SCHEDULE = gql`
  mutation UpdateEmployeeSchedule(
    $updateEmployeeScheduleInput: UpdateEmployeeScheduleInput!
  ) {
    updateEmployeeSchedule(
      updateEmployeeScheduleInput: $updateEmployeeScheduleInput
    ) {
      success
      statusCode
      message
      data {
        userId
        workScheduleId
        isActive
        assignedBy
        notes
        startDate
        endDate
        workSchedule {
          id
          name
          description
        }
      }
    }
  }
`;
