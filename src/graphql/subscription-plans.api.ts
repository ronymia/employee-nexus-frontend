import { gql } from "@apollo/client";

export const GET_SUBSCRIPTION_PLANS = gql`
  query SubscriptionPlans {
    subscriptionPlans {
      message
      statusCode
      success
      data {
        createdAt
        createdBy
        description
        id
        name
        price
        setupFee
        status
        updatedAt
      }
    }
  }
`;

export const CREATE_SUBSCRIPTION_PLAN = gql`
  mutation CreateSubscriptionPlan(
    $name: String!
    $description: String!
    $price: Int!
    $setupFee: Int!
    $featureIds: [Int!]!
  ) {
    createSubscriptionPlan(
      createSubscriptionPlanInput: {
        name: $name
        description: $description
        price: $price
        setupFee: $setupFee
        featureIds: $featureIds
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        price
        setupFee
        status
        createdAt
        updatedAt
        createdBy
      }
    }
  }
`;
export const UPDATE_SUBSCRIPTION_PLAN = gql`
  mutation UpdateServicePlan(
    $id: Int!
    $name: String!
    $description: String!
    $price: Int!
    $setupFee: Int!
    $featureIds: [Int!]!
  ) {
    updateSubscriptionPlan(
      id: $id
      updateSubscriptionPlanInput: {
        name: $name
        description: $description
        price: $price
        setupFee: $setupFee
        featureIds: $featureIds
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        price
        setupFee
        status
        createdAt
        updatedAt
        createdBy
      }
    }
  }
`;

export const DELETE_SUBSCRIPTION_PLAN = gql`
  mutation RemoveSubscriptionPlan($id: Int!) {
    removeSubscriptionPlan(id: $id) {
      message
      statusCode
      success
    }
  }
`;
