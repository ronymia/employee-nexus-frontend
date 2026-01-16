import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_DESIGNATION = gql`
  mutation ($assignEmployeeDesignationInput: AssignEmployeeDesignationInput!) {
    assignEmployeeDesignation(
      assignEmployeeDesignationInput: $assignEmployeeDesignationInput
    ) {
      message
      statusCode
      success
      data {
        userId
        designationId
        startDate
        endDate
        salary
        isActive
      }
    }
  }
`;

export const GET_EMPLOYEE_DESIGNATION = gql`
  query ($getEmployeeDesignationsInput: GetEmployeeDesignationsInput!) {
    getEmployeeDesignations(
      getEmployeeDesignationsInput: $getEmployeeDesignationsInput
    ) {
      message
      statusCode
      success
      data {
        userId
        designationId
        designation {
          name
        }
        startDate
        endDate
        salary
        isActive
      }
    }
  }
`;
