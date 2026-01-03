import { gql } from "@apollo/client";

export const GET_WORK_SITES = gql`
  query WorkSites {
    workSites {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        lat
        lng
        maxRadius
        ipAddress
        locationTrackingType
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_WORK_SITES = gql`
  mutation CreateWorkSite($createWorkSiteInput: CreateWorkSiteInput!) {
    createWorkSite(createWorkSiteInput: $createWorkSiteInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        lat
        lng
        maxRadius
        ipAddress
        locationTrackingType
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_WORK_SITES = gql`
  mutation UpdateWorkSite($updateWorkSiteInput: UpdateWorkSiteInput!) {
    updateWorkSite(updateWorkSiteInput: $updateWorkSiteInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        lat
        lng
        maxRadius
        ipAddress
        locationTrackingType
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_WORK_SITES = gql`
  mutation DeleteWorkSite($id: Int!) {
    deleteWorkSite(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        lat
        lng
        maxRadius
        ipAddress
        locationTrackingType
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

// ==================== EMPLOYEE WORK SITE ASSIGNMENT ====================

export const ASSIGN_WORK_SITE = gql`
  mutation AssignWorkSite($input: AssignWorkSiteInput!) {
    assignWorkSite(input: $input) {
      success
      message
      data {
        id
        userId
        workSiteId
        workSite {
          name
          address
        }
        createdAt
      }
    }
  }
`;

export const UNASSIGN_WORK_SITE = gql`
  mutation UnassignWorkSite($input: UnassignWorkSiteInput!) {
    unassignWorkSite(input: $input) {
      success
      message
      data {
        id
        userId
        workSiteId
      }
    }
  }
`;
