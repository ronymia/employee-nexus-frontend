import { gql } from "@apollo/client";

export const GET_ASSET_TYPES = gql`
  query AssetTypes {
    assetTypes {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_ASSET_TYPE = gql`
  mutation CreateAssetType($name: String!, $description: String!) {
    createAssetType(
      createAssetTypeInput: { name: $name, description: $description }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_ASSET_TYPE = gql`
  mutation UpdateAssetType($id: Int!, $name: String!, $description: String) {
    updateAssetType(
      updateAssetTypeInput: { id: $id, name: $name, description: $description }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_ASSET_TYPE = gql`
  mutation RemoveAssetType($id: Int!) {
    removeAssetType(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;
