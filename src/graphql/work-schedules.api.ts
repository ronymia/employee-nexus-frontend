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
        breakHours
        businessId
        createdBy
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
        breakHours
        businessId
        createdBy
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
        breakHours
        businessId
        createdBy
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
    $id: Int!
    $updateWorkScheduleInput: UpdateWorkScheduleInput!
  ) {
    updateWorkSchedule(
      id: $id
      updateWorkScheduleInput: $updateWorkScheduleInput
    ) {
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
        breakHours
        businessId
        createdBy
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
