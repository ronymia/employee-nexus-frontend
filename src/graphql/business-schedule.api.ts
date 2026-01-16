import { gql } from "@apollo/client";

export const GET_BUSINESS_SCHEDULE_BY_BUSINESS_ID = gql`
  query BusinessSchedulesByBusinessId($businessId: Int!) {
    businessSchedulesByBusinessId(businessId: $businessId) {
      success
      statusCode
      message
      data {
        id
        dayOfWeek
        isWeekend
        startTime
        endTime
        businessId
      }
    }
  }
`;

export const GET_BUSINESS_SCHEDULE_BY_ID = gql`
  query BusinessScheduleById($id: Int!) {
    businessScheduleById(id: $id) {
      success
      statusCode
      message
      data {
        id
        dayOfWeek
        isWeekend
        startTime
        endTime
        businessId
      }
    }
  }
`;

export const UPDATE_BUSINESS_SCHEDULE = gql`
  mutation UpdateBusinessSchedule(
    $businessId: Int!
    $updateBusinessScheduleInput: UpdateBusinessScheduleInput!
  ) {
    updateBusinessSchedule(
      businessId: $businessId
      updateBusinessScheduleInput: $updateBusinessScheduleInput
    ) {
      message
      statusCode
      success
      data {
        id
        businessId
        dayOfWeek
        startTime
        endTime
        isWeekend
      }
    }
  }
`;
