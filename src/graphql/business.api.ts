import { gql } from "@apollo/client";

export const GET_BUSINESSES = gql`
  query Businesses {
    businesses {
      message
      statusCode
      success
      data {
        address
        city
        country
        createdAt
        email
        id
        lat
        long
        name
        numberOfEmployeesAllowed
        phone
        postcode
        registrationDate
        status
        subscriptionPlanId
        updatedAt
        userId
        website
      }
    }
  }
`;
