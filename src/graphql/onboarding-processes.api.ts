import { gql } from "@apollo/client";

export const GET_ONBOARDING_PROCESSES = gql`
  query OnboardingProcesses {
    onboardingProcesses {
      message
      statusCode
      success
      data {
        description
        id
        name
        isRequired
        status
      }
    }
  }
`;
export const CREATE_ONBOARDING_PROCESSES = gql`
  mutation CreateOnboardingProcess(
    $name: String!
    $description: String!
    $isRequired: Boolean!
  ) {
    createOnboardingProcess(
      createOnboardingProcessInput: {
        name: $name
        description: $description
        isRequired: $isRequired
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        isRequired
        name
        status
        updatedAt
      }
    }
  }
`;
export const UPDATE_ONBOARDING_PROCESSES = gql`
  mutation UpdateOnboardingProcess(
    $id: Int!
    $name: String!
    $isRequired: Boolean!
    $description: String!
  ) {
    updateOnboardingProcess(
      updateOnboardingProcessInput: {
        id: $id
        name: $name
        description: $description
        isRequired: $isRequired
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        name
        isRequired
        status
        updatedAt
      }
    }
  }
`;
export const DELETE_ONBOARDING_PROCESSES = gql`
  mutation DeleteOnboardingProcess($id: Int!) {
    deleteOnboardingProcess(id: $id) {
      message
      statusCode
      success
      data {
        businessId
        createdAt
        createdBy
        description
        id
        name
        status
        isRequired
        updatedAt
      }
    }
  }
`;
