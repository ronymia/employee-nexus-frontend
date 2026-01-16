import { gql } from "@apollo/client";

export const ASSIGN_EMPLOYEE_WORK_SITE = gql`
  mutation ($assignEmployeeWorkSiteInput: AssignEmployeeWorkSiteInput!) {
    assignEmployeeWorkSite(
      assignEmployeeWorkSiteInput: $assignEmployeeWorkSiteInput
    ) {
      success
      message
      data {
        workSite {
          name
          address
        }
        startDate
        isActive
      }
    }
  }
`;
export const GET_EMPLOYEE_WORK_SITES = gql`
  query GetEmployeeWorkSites(
    $queryEmployeeWorkSitesInput: QueryEmployeeWorkSitesInput
  ) {
    getEmployeeWorkSites(
      queryEmployeeWorkSitesInput: $queryEmployeeWorkSitesInput
    ) {
      success
      statusCode
      message
      data {
        userId
        workSiteId
        startDate
        endDate
        isActive
        workSite {
          name
          address
          status
        }
      }
    }
  }
`;
