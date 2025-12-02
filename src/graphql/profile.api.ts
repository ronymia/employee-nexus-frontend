import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      message
      statusCode
      success
      data {
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
  }
`;
export const UPDATE_EMERGENCY_CONTACT = gql`
  mutation UpdateEmergencyContact(
    $updateEmergencyContactInput: UpdateEmergencyContactInput!
  ) {
    updateEmergencyContact(
      updateEmergencyContactInput: $updateEmergencyContactInput
    ) {
      message
      statusCode
      success
      data {
        createdAt
        name
        phone
        profileId
        relation
        updatedAt
      }
    }
  }
`;
export const UPDATE_EMPLOYMENT_DETAILS = gql`
  mutation UpdateEmploymentDetails(
    $updateEmploymentDetailsInput: UpdateEmploymentDetailsInput!
  ) {
    updateEmploymentDetails(
      updateEmploymentDetailsInput: $updateEmploymentDetailsInput
    ) {
      success
      statusCode
      message
      data {
        id
        employeeId
        nidNumber
        joiningDate
        salaryPerMonth
        workingDaysPerWeek
        workingHoursPerWeek
        designationId
        employmentStatusId
        departmentId
        workSiteId
        workScheduleId
        createdAt
        updatedAt
      }
    }
  }
`;
