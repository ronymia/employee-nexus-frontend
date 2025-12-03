import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        businessId
        email
        status
        updatedAt
        createdAt
        role {
          name
        }
        permissions
        profile {
          id
          userId
          address
          city
          country
          dateOfBirth
          fullName
          gender
          maritalStatus
          phone
          postcode
          profilePicture
          updatedAt
          createdAt
        }
      }
    }
  }
`;
