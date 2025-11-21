import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
  query Assets {
    assets {
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
  mutation CreateAsset(
    $name: String!
    $code: String!
    $date: String!
    $note: String
    $assetTypeId: Int
    $image: String
  ) {
    createAsset(
      createAssetInput: {
        name: $name
        code: $code
        date: $date
        note: $note
        assetTypeId: $assetTypeId
        image: $image
      }
    ) {
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
  mutation UpdateAsset(
    $id: Int!
    $name: String!
    $code: String!
    $date: String!
    $note: String
    $assetTypeId: Int
    $image: String
  ) {
    updateAsset(
      updateAssetInput: {
        id: $id
        name: $name
        code: $code
        date: $date
        note: $note
        assetTypeId: $assetTypeId
        image: $image
      }
    ) {
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
