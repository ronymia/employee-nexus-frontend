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
        isLocationEnabled
        isGeoLocationEnabled
        maxRadius
        isIpEnabled
        ipAddress
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_WORK_SITES = gql`
  mutation CreateWorkSite(
    $name: String!
    $description: String!
    $address: String
    $isLocationEnabled: Boolean
    $isGeoLocationEnabled: Boolean
    $maxRadius: Int
    $isIpEnabled: Boolean
    $ipAddress: String
  ) {
    createWorkSite(
      createWorkSiteInput: {
        name: $name
        description: $description
        address: $address
        isLocationEnabled: $isLocationEnabled
        isGeoLocationEnabled: $isGeoLocationEnabled
        maxRadius: $maxRadius
        isIpEnabled: $isIpEnabled
        ipAddress: $ipAddress
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        isLocationEnabled
        isGeoLocationEnabled
        maxRadius
        isIpEnabled
        ipAddress
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_WORK_SITES = gql`
  mutation UpdateWorkSite(
    $id: Int!
    $name: String!
    $description: String!
    $address: String
    $isLocationEnabled: Boolean
    $isGeoLocationEnabled: Boolean
    $maxRadius: Int
    $isIpEnabled: Boolean
    $ipAddress: String
  ) {
    updateWorkSite(
      updateWorkSiteInput: {
        id: $id
        name: $name
        description: $description
        address: $address
        isLocationEnabled: $isLocationEnabled
        isGeoLocationEnabled: $isGeoLocationEnabled
        maxRadius: $maxRadius
        isIpEnabled: $isIpEnabled
        ipAddress: $ipAddress
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        address
        isLocationEnabled
        isGeoLocationEnabled
        maxRadius
        isIpEnabled
        ipAddress
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
        isLocationEnabled
        isGeoLocationEnabled
        maxRadius
        isIpEnabled
        ipAddress
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
