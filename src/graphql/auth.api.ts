import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        business {
          id
          name
        }
        profile {
          fullName
        }
        role {
          name
        }
      }
    }
  }
`;
