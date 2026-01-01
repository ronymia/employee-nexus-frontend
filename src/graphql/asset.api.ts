import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
  query Assets($query: QueryAssetInput) {
    assets(query: $query) {
      message
      statusCode
      success
      data {
        id
        name
        code
        date
        note
        assetTypeId
        assetType {
          id
          name
        }
        image
        status
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation CreateAsset($createAssetInput: CreateAssetInput!) {
    createAsset(createAssetInput: $createAssetInput) {
      message
      statusCode
      success
      data {
        id
        name
        code
        date
        note
        assetTypeId
        assetType {
          id
          name
        }
        image
        status
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($updateAssetInput: UpdateAssetInput!) {
    updateAsset(updateAssetInput: $updateAssetInput) {
      message
      statusCode
      success
      data {
        id
        name
        code
        date
        note
        assetTypeId
        assetType {
          id
          name
        }
        image
        status
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: Int!) {
    deleteAsset(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        code
        date
        note
        assetTypeId
        assetType {
          id
          name
        }
        image
        status
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ASSETS_BY_USER_ID = gql`
  query GetAssetsByUserId($userId: Int!) {
    assetsByUserId(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        name
        code
        status
        date
        note
        image
        assetTypeId
        assetType {
          id
          name
        }
        assetAssignments {
          id
          assetId
          assignedTo
          assignedBy
          assignedAt
          returnedAt
          status
          note
          assignedToUser {
            id
            email
            profile {
              fullName
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
        createdAt
        updatedAt
      }
    }
  }
`;

export const ASSIGN_ASSET = gql`
  mutation AssignAsset($assignAssetInput: AssignAssetInput!) {
    assignAsset(assignAssetInput: $assignAssetInput) {
      success
      statusCode
      message
      data {
        id
        assetId
        assignedTo
        assignedBy
        assignedAt
        returnedAt
        status
        note
        asset {
          id
          name
          code
          status
        }
        assignedToUser {
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

export const RETURN_ASSET = gql`
  mutation ReturnAsset($returnAssetInput: ReturnAssetInput!) {
    returnAsset(returnAssetInput: $returnAssetInput) {
      success
      statusCode
      message
      data {
        id
        assetId
        assignedTo
        assignedBy
        assignedAt
        returnedAt
        status
        note
      }
    }
  }
`;

export const GET_USER_ASSET_ASSIGNMENTS = gql`
  query GetUserAssetAssignments($userId: Int!) {
    userAssetAssignments(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        assignedAt
        returnedAt
        note
        status
        asset {
          id
          name
          code
          image
          assetType {
            id
            name
          }
        }
        assignedToUser {
          id
          email
          profile {
            fullName
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
