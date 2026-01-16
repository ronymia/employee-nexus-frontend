import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  mutation ($assignEmployeeStatusInput: AssignEmployeeStatusInput!) {
    assignEmployeeStatus(
      assignEmployeeStatusInput: $assignEmployeeStatusInput
    ) {
      success
      statusCode
      message
      data {
        userId
        employmentStatusId
        employmentStatus {
          name
          description
        }
        startDate
        endDate
        isActive
        reason
        remarks
      }
    }
  }
`;
export const GET_EMPLOYEE_EMPLOYMENT_STATUS = gql`
  query ($getEmployeeStatusesInput: GetEmployeeStatusesInput!) {
    getEmployeeStatuses(getEmployeeStatusesInput: $getEmployeeStatusesInput) {
      success
      message
      data {
        employmentStatus {
          name
        }
        startDate
        isActive
        reason
      }
    }
  }
`;
