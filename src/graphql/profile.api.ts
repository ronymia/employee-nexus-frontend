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
          userId
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
          socialLinks {
            facebook
            twitter
            linkedin
            instagram
            github
          }
        }
        role {
          id
          name
        }
        employee {
          userId
          employeeId
          joiningDate
          nidNumber
          # salaries
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
          # workSite {
          #   id
          #   name
          # }
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
        userId
        address
        city
        country
        dateOfBirth
        fullName
        gender
        maritalStatus
        phone
        postcode
        profilePicture
        createdAt
        updatedAt
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
        userId
        name
        phone
        relation
        createdAt
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
        userId
        employeeId
        nidNumber
        joiningDate
        salaryPerMonth
        workingDaysPerWeek
        workingHoursPerWeek
        designationId
        employmentStatusId
        departmentId
        workScheduleId
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
  mutation ChangeMyPassword($changeMyPasswordInput: ChangeMyPasswordInput!) {
    changeMyPassword(changeMyPasswordInput: $changeMyPasswordInput) {
      success
      message
    }
  }
`;
