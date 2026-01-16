import { gql } from "@apollo/client";

export const BUSINESS_SETTING_BY_BUSINESS_ID = gql`
  query BusinessSettingByBusinessId($businessId: Int!) {
    businessSettingByBusinessId(businessId: $businessId) {
      message
      statusCode
      success
      data {
        businessId
        businessStartDay
        businessTimeZone
        currency
        deleteReadNotifications
        identifierPrefix
        theme
        googleApiKey
      }
    }
  }
`;

export const UPDATE_BUSINESS_SETTING = gql`
  mutation UpdateBusinessSetting(
    $businessId: Int!
    $updateBusinessSettingInput: UpdateBusinessSettingInput!
  ) {
    updateBusinessSetting(
      businessId: $businessId
      updateBusinessSettingInput: $updateBusinessSettingInput
    ) {
      message
      statusCode
      success
      data {
        businessId
        businessStartDay
        businessTimeZone
        currency
        deleteReadNotifications
        identifierPrefix
        theme
        googleApiKey
      }
    }
  }
`;
