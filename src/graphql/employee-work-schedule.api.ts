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
  query ($getEmployeeSchedulesInput: GetEmployeeSchedulesInput!) {
    getEmployeeSchedules(
      getEmployeeSchedulesInput: $getEmployeeSchedulesInput
    ) {
      success
      data {
        workSchedule {
          name
        }
        isActive
        assignedByUser {
          email
        }
      }
    }
  }
`;
