import { gql } from "@apollo/client";

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    getMyProfile {
      success
      message
      data {
        id
        email
        roleId
        status
        profile {
          id
          fullName
          address
          city
          country
          dateOfBirth
          gender
          maritalStatus
          phone
          postcode
          profilePicture
          emergencyContact {
            name
            phone
            relation
          }
        }
        role {
          id
          name
        }
        employee {
          id
          employeeId
          departmentId
          designationId
          employmentStatusId
          workSiteId
          workScheduleId
          joiningDate
          salaryPerMonth
          nidNumber
          rotaType
          workingDaysPerWeek
          workingHoursPerWeek
          department {
            id
            name
          }
          designation {
            id
            name
          }
          employmentStatus {
            id
            name
          }
          workSite {
            id
            name
          }
          workSchedule {
            id
            name
          }
        }
      }
    }
  }
`;

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

export const UPDATE_SOCIAL_LINKS = gql`
  mutation UpdateSocialLinks($updateSocialLinkInput: UpdateSocialLinkInput!) {
    updateSocialLink(updateSocialLinkInput: $updateSocialLinkInput) {
      success
      statusCode
      message
      data {
        profileId
        facebook
        twitter
        linkedin
        instagram
        github
      }
    }
  }
`;

export const CHANGE_MY_PASSWORD = gql`
  mutation ChangeMyPassword($changePasswordInput: ChangePasswordInput!) {
    changeMyPassword(changePasswordInput: $changePasswordInput) {
      success
      message
    }
  }
`;
