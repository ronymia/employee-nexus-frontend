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

// export const CREATE_BUSINESSES = gql`
//   mutation CreateBusiness(

//   ) {
//     createBusiness(
//       createBusinessInput: {
//         address: null
//         city: null
//         country: null
//         email: null
//         lat: null
//         long: null
//         name: null
//         numberOfEmployeesAllowed: null
//         phone: null
//         registrationDate: null
//         postcode: null
//         subscriptionPlanId: null
//         website: null
//       }
//     ) {
//       address
//       city
//       country
//       createdAt
//       email
//       id
//       lat
//       long
//       name
//       numberOfEmployeesAllowed
//       phone
//       postcode
//       registrationDate
//       status
//       subscriptionPlanId
//       updatedAt
//       userId
//       website
//     }
//   }
// `;

export const REGISTER_USER_WITH_BUSINESSES = gql`
  mutation CreateUserWithBusiness(
    $createUserInput: CreateUserInput!
    $createBusinessInput: CreateBusinessInput!
    $createProfileInput: CreateProfileInput!
  ) {
    createUserWithBusiness(
      createUserInput: $createUserInput
      createBusinessInput: $createBusinessInput
      createProfileInput: $createProfileInput
    ) {
      id
      name
      email
      website
      phone
      address
      status
      createdAt
    }
  }
`;
// export const REGISTER_USER_WITH_BUSINESSES = gql`
//   mutation CreateUserWithBusiness {
//     createUserWithBusiness(
//       createBusinessInput: {
//         address: null
//         city: null
//         country: null
//         email: null
//         lat: null
//         long: null
//         name: null
//         numberOfEmployeesAllowed: null
//         phone: null
//         postcode: null
//         registrationDate: null
//         subscriptionPlanId: null
//         website: null
//       }
//       createProfileInput: {
//         address: null
//         city: null
//         country: null
//         dateOfBirth: null
//         fullName: null
//         gender: null
//         maritalStatus: null
//         phone: null
//         postcode: null
//         profilePicture: null
//       }
//       createUserInput: { email: null, password: null }
//     ) {
//       address
//       city
//       country
//       createdAt
//       email
//       id
//       lat
//       long
//       name
//       numberOfEmployeesAllowed
//       phone
//       postcode
//       registrationDate
//       status
//       subscriptionPlanId
//       updatedAt
//       userId
//       website
//     }
//   }
// `;
