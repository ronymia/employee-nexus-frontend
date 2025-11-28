import { gql } from "@apollo/client";

export const GET_FEATURES = gql`
  query AllFeatures {
    allFeatures {
      message
      statusCode
      success
      data {
        id
        name
      }
    }
  }
`;
