import { gql } from "@apollo/client";

export const GET_BUSINESS_SUBSCRIPTIONS = gql`
  query BusinessSubscriptions($query: QueryBusinessSubscriptionInput) {
    businessSubscriptions(query: $query) {
      success
      statusCode
      message
      #   meta {
      #     total
      #     page
      #     limit
      #     totalPages
      #   }
      data {
        id
        businessId
        subscriptionPlanId
        subscriptionPlan {
          id
          name
          description
          price
          setupFee
          status
          createdAt
          updatedAt
        }
        trialEndDate
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const BUSINESS_SUBSCRIPTION_BY_ID = gql`
  query BusinessSubscriptionById($id: Int!) {
    businessSubscriptionById(id: $id) {
      success
      statusCode
      message
      data {
        id
        businessId
        subscriptionPlanId
        trialEndDate
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const ACTIVE_BUSINESS_SUBSCRIPTION = gql`
  query ActiveBusinessSubscription($businessId: Int) {
    activeBusinessSubscription(businessId: $businessId) {
      success
      statusCode
      message
      data {
        id
        businessId
        subscriptionPlanId
        trialEndDate
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const CANCEL_BUSINESS_SUBSCRIPTION = gql`
  mutation CancelBusinessSubscription($id: Int!) {
    cancelBusinessSubscription(id: $id) {
      success
      statusCode
      message
      data {
        id
        businessId
        subscriptionPlanId
        trialEndDate
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;
export const RENEW_BUSINESS_SUBSCRIPTION = gql`
  mutation RenewBusinessSubscription(
    $renewBusinessSubscriptionInput: RenewBusinessSubscriptionInput!
  ) {
    renewBusinessSubscription(
      renewBusinessSubscriptionInput: $renewBusinessSubscriptionInput
    ) {
      success
      statusCode
      message
      data {
        id
        businessId
        subscriptionPlanId
        trialEndDate
        startDate
        endDate
        status
        createdAt
        updatedAt
      }
    }
  }
`;
