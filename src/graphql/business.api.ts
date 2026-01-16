import { gql } from "@apollo/client";

// GET ALL BUSINESSES
export const GET_BUSINESSES = gql`
  query Businesses {
    businesses {
      message
      statusCode
      success
      data {
        ownerId
        address
        city
        country
        email
        id
        name
        phone
        postcode
        registrationDate
        status
        subscription {
          id
          subscriptionPlanId
          startDate
          endDate
          trialEndDate
          status
          numberOfEmployeesAllowed
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// GET BUSINESS BY ID
export const GET_BUSINESS_BY_ID = gql`
  query BusinessById($id: Int!) {
    businessById(id: $id) {
      success
      statusCode
      message
      data {
        id
        name
        email
        ownerId
        address
        city
        phone
        country
        postcode
        registrationDate
        status
        subscription {
          id
          subscriptionPlanId
          startDate
          endDate
          trialEndDate
          numberOfEmployeesAllowed
        }
        website
        createdAt
        updatedAt
        owner {
          id
          email
          roleId
          status
          profile {
            userId
            fullName
            address
            phone
            city
            country
            postcode
            gender
            dateOfBirth
            maritalStatus
            profilePicture
          }
        }
        # businessSchedules {
        #   id
        #   businessId
        #   day
        #   endTime
        #   isWeekend
        #   startTime
        # }
        # subscriptionPlan {
        #   id
        #   name
        #   price
        #   setupFee
        #   status
        #   description
        #   createdAt
        #   updatedAt
        # }
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
      ownerId
      website
      phone
      address
      city
      country
      postcode
      registrationDate
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($updateBusinessInput: UpdateBusinessInput!) {
    updateBusiness(updateBusinessInput: $updateBusinessInput) {
      message
      statusCode
      success
      data {
        id
        name
        email
        phone
        address
        city
        country
        postcode
        website
        status
      }
    }
  }
`;

export const DELETE_BUSINESS = gql`
  mutation DeleteBusiness($id: Int!) {
    deleteBusiness(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;
