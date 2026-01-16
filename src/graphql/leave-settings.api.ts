import { gql } from "@apollo/client";

export const GET_LEAVE_SETTINGS = gql`
  query LeaveSettingByBusinessId {
    leaveSettingByBusinessId {
      message
      statusCode
      success
      data {
        businessId
        startMonth
        autoApproval
      }
    }
  }
`;

export const UPDATE_LEAVE_SETTINGS = gql`
  mutation UpdateLeaveSetting($startMonth: Int, $autoApproval: Boolean) {
    updateLeaveSetting(
      updateLeaveSettingInput: {
        startMonth: $startMonth
        autoApproval: $autoApproval
      }
    ) {
      message
      statusCode
      success
      data {
        businessId
        startMonth
        autoApproval
      }
    }
  }
`;
