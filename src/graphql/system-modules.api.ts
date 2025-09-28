import { gql } from "@apollo/client";

export const GET_SYSTEM_MODULES = gql`
  query SystemModules {
    systemModules {
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
