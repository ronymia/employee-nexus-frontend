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
        createdBy
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
        createdBy
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
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_ASSET_TYPE = gql`
  mutation DeleteAssetType($id: Int!) {
    deleteAssetType(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        status
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;
