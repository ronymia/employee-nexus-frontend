import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query Roles {
    roles {
      message
      statusCode
      success
      data {
        id
        name
        businessId
      }
    }
  }
`;
