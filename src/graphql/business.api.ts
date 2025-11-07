import { gql } from "@apollo/client";

// GET ALL BUSINESSES
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
        lng
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

// GET BUSINESS BY ID
export const GET_BUSINESS_BY_ID = gql`
  query BusinessById($id: Int!) {
    businessById(id: $id) {
      address
      city
      createdAt
      email
      id
      lat
      lng
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
      user {
        createdAt
        deletedBy
        email
        id
        roleId
        status
        updatedAt
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
      businessSchedules {
        businessId
        day
        endTime
        id
        isWeekend
        startTime
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
