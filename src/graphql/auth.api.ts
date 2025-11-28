import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        createdAt
        deletedBy
        email
        id
        status
        updatedAt
        role {
          name
        }
        permissions
        profile {
          address
          city
          country
          createdAt
          dateOfBirth
          fullName
          gender
          id
          maritalStatus
          phone
          postcode
          profilePicture
          updatedAt
          userId
        }
      }
    }
  }
`;
