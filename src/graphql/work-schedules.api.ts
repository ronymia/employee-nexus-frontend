import { gql } from "@apollo/client";

// GET ALL WORK SCHEDULES
export const GET_WORK_SCHEDULES = gql`
  query WorkSchedules {
    workSchedules {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        scheduleType
        breakType
        breakMinutes
        businessId
        createdAt
        updatedAt
        schedules {
          id
          day
          isWeekend
          workScheduleId
          timeSlots {
            startTime
            endTime
            scheduleId
          }
        }
      }
    }
  }
`;

// GET WORK SCHEDULE BY ID
export const GET_WORK_SCHEDULE_BY_ID = gql`
  query WorkScheduleById($id: Int!) {
    workScheduleById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        scheduleType
        breakType
        breakMinutes
        businessId
        createdAt
        updatedAt
        schedules {
          id
          day
          isWeekend
          workScheduleId
          timeSlots {
            startTime
            endTime
            scheduleId
          }
        }
      }
    }
  }
`;

// CREATE WORK SCHEDULE
export const CREATE_WORK_SCHEDULE = gql`
  mutation CreateWorkSchedule(
    $createWorkScheduleInput: CreateWorkScheduleInput!
  ) {
    createWorkSchedule(createWorkScheduleInput: $createWorkScheduleInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        scheduleType
        breakType
        breakMinutes
        businessId
        createdAt
        updatedAt
        schedules {
          id
          day
          isWeekend
          workScheduleId
          timeSlots {
            startTime
            endTime
            scheduleId
          }
        }
      }
    }
  }
`;

// UPDATE WORK SCHEDULE
export const UPDATE_WORK_SCHEDULE = gql`
  mutation UpdateWorkSchedule(
    $updateWorkScheduleInput: UpdateWorkScheduleInput!
  ) {
    updateWorkSchedule(updateWorkScheduleInput: $updateWorkScheduleInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        scheduleType
        breakType
        breakMinutes
        businessId
        createdAt
        updatedAt
        schedules {
          id
          day
          isWeekend
          workScheduleId
          timeSlots {
            startTime
            endTime
            scheduleId
          }
        }
      }
    }
  }
`;

// DELETE WORK SCHEDULE
export const DELETE_WORK_SCHEDULE = gql`
  mutation DeleteWorkSchedule($id: Int!) {
    deleteWorkSchedule(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// GET USER SCHEDULE ASSIGNMENTS
export const GET_USER_SCHEDULE_ASSIGNMENTS = gql`
  query UserScheduleAssignments($userId: Int!) {
    employeeScheduleAssignmentsByUser(userId: $userId) {
      message
      statusCode
      success
      data {
        id
        userId
        workScheduleId
        startDate
        endDate
        isActive
        assignedBy
        notes
        createdAt
        updatedAt
        workSchedule {
          id
          name
          description
          status
          scheduleType
          breakType
          breakMinutes
          schedules {
            id
            day
            isWeekend
            workScheduleId
            timeSlots {
              startTime
              endTime
              scheduleId
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

// CREATE EMPLOYEE SCHEDULE ASSIGNMENT
export const CREATE_EMPLOYEE_SCHEDULE_ASSIGNMENT = gql`
  mutation CreateEmployeeScheduleAssignment(
    $createEmployeeScheduleAssignmentInput: CreateEmployeeScheduleAssignmentInput!
  ) {
    createEmployeeScheduleAssignment(
      createEmployeeScheduleAssignmentInput: $createEmployeeScheduleAssignmentInput
    ) {
      message
      statusCode
      success
      data {
        id
        userId
        workScheduleId
        startDate
        endDate
        isActive
        assignedBy
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

// UPDATE EMPLOYEE SCHEDULE ASSIGNMENT
export const UPDATE_EMPLOYEE_SCHEDULE_ASSIGNMENT = gql`
  mutation UpdateEmployeeScheduleAssignment(
    $id: Int!
    $updateEmployeeScheduleAssignmentInput: UpdateEmployeeScheduleAssignmentInput!
  ) {
    updateEmployeeScheduleAssignment(
      id: $id
      updateEmployeeScheduleAssignmentInput: $updateEmployeeScheduleAssignmentInput
    ) {
      message
      statusCode
      success
      data {
        id
        userId
        workScheduleId
        startDate
        endDate
        isActive
        assignedBy
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

// DELETE EMPLOYEE SCHEDULE ASSIGNMENT
export const DELETE_EMPLOYEE_SCHEDULE_ASSIGNMENT = gql`
  mutation DeleteEmployeeScheduleAssignment($id: Int!) {
    deleteEmployeeScheduleAssignment(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// ==================== GET USER WORK SCHEDULE ====================

export const GET_USER_WORK_SCHEDULE = gql`
  query GetUserWorkSchedule($userId: Int!) {
    getUserWorkSchedule(userId: $userId) {
      success
      message
      data {
        id
        name
        description
        scheduleType
        status
        schedules {
          day
          isWeekend
          timeSlots {
            startTime
            endTime
          }
        }
        business {
          id
          name
        }
        creator {
          id
          profile {
            fullName
          }
        }
      }
    }
  }
`;
