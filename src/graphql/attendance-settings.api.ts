import { gql } from "@apollo/client";

export const GET_ATTENDANCE_SETTINGS = gql`
  query AttendanceSettingsByBusiness {
    attendanceSettingsByBusiness {
      message
      statusCode
      success
      data {
        id
        businessId
        punchInTimeTolerance
        workAvailabilityDefinition
        punchInOutAlert
        punchInOutInterval
        autoApproval
        isGeoLocationEnabled
      }
    }
  }
`;

export const UPDATE_ATTENDANCE_SETTINGS = gql`
  mutation UpdateAttendanceSetting(
    $punchInTimeTolerance: Int
    $workAvailabilityDefinition: Int
    $punchInOutAlert: Boolean
    $punchInOutInterval: Int
    $autoApproval: Boolean
    $isGeoLocationEnabled: Boolean
  ) {
    updateAttendanceSetting(
      updateAttendanceSettingInput: {
        punchInTimeTolerance: $punchInTimeTolerance
        workAvailabilityDefinition: $workAvailabilityDefinition
        punchInOutAlert: $punchInOutAlert
        punchInOutInterval: $punchInOutInterval
        autoApproval: $autoApproval
        isGeoLocationEnabled: $isGeoLocationEnabled
      }
    ) {
      message
      statusCode
      success
      data {
        id
        businessId
        punchInTimeTolerance
        workAvailabilityDefinition
        punchInOutAlert
        punchInOutInterval
        autoApproval
        isGeoLocationEnabled
      }
    }
  }
`;
