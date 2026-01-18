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
  query WorkSiteHistory($userId: Int!) {
    workSiteHistory(userId: $userId) {
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
          id
          name
          description
          status
          address
          lat
          lng
          locationTrackingType
          maxRadius
          ipAddress
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ACTIVE_EMPLOYEE_WORK_SITES = gql`
  query GetActiveWorkSites($userId: Int!) {
    getActiveWorkSites(userId: $userId) {
      success
      statusCode
      message
      data {
        userId
        workSiteId
        isActive
        startDate
        endDate
        employee {
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
        }
        workSite {
          id
          name
          address
        }
      }
    }
  }
`;

export const GET_EMPLOYEE_WORK_SITE_BY_ID = gql`
  query GetWorkSiteById($userId: Int!, $workSiteId: Int!) {
    getWorkSiteById(userId: $userId, workSiteId: $workSiteId) {
      success
      statusCode
      message
      data {
        userId
        workSiteId
        isActive
        startDate
        endDate
        employee {
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
        }
        workSite {
          id
          name
          address
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_WORK_SITE = gql`
  mutation UpdateEmployeeWorkSite(
    $updateEmployeeWorkSiteInput: UpdateEmployeeWorkSiteInput!
  ) {
    updateEmployeeWorkSite(
      updateEmployeeWorkSiteInput: $updateEmployeeWorkSiteInput
    ) {
      success
      statusCode
      message
      data {
        userId
        workSiteId
        isActive
        startDate
        endDate
        workSite {
          id
          name
          address
        }
      }
    }
  }
`;
