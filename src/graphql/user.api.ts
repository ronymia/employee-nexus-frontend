import { gql } from "@apollo/client";

export const GENERATE_USER_EMPLOYEE_ID = gql`
  query GenerateEmployeeId {
    generateEmployeeId
  }
`;

export const GET_USERS = gql`
  query Users($query: QueryUserInput) {
    users(query: $query) {
      message
      statusCode
      success
      data {
        id
        email
        roleId
        status
        createdAt
        updatedAt
        profile {
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
        }
        role {
          id
          name
        }
        employee {
          employeeId
          designations {
            designation {
              id
              name
            }
          }
          departments {
            department {
              id
              name
            }
          }
          employmentStatuses {
            employmentStatus {
              id
              name
            }
          }
          workSchedules {
            workSchedule {
              id
              name
            }
          }
          workSites {
            workSite {
              id
              name
            }
          }
        }
      }
    }
  }
`;
export const GET_BUSINESS_USER_BY_ID = gql`
  query UserById($id: Int!) {
    userById(id: $id) {
      message
      statusCode
      success
      data {
        id
        email
        roleId
        status
        createdAt
        updatedAt
        profile {
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
        }
        role {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query UserById($id: Int!) {
    userById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        email
        roleId
        status
        createdAt
        updatedAt
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
        }
        role {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $roleId: Int!
    $status: Status!
    $profile: CreateProfileInput!
  ) {
    createUser(
      createUserInput: {
        name: $name
        email: $email
        password: $password
        roleId: $roleId
        status: $status
        profile: $profile
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        email
        roleId
        status
        createdAt
        updatedAt
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
        }
        role {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: Int!
    $name: String!
    $email: String!
    $roleId: Int!
    $status: Status!
    $profile: UpdateProfileInput!
  ) {
    updateUser(
      updateUserInput: {
        id: $id
        name: $name
        email: $email
        roleId: $roleId
        status: $status
        profile: $profile
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        email
        roleId
        status
        createdAt
        updatedAt
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
        }
        role {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangePassword($id: Int!, $newPassword: String!) {
    changePassword(
      changePasswordInput: { id: $id, newPassword: $newPassword }
    ) {
      message
      statusCode
      success
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      message
      statusCode
      success
      data {
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
      }
    }
  }
`;

export const GET_USER_STATISTICS = gql`
  query UserStatistics {
    userStatistics {
      success
      statusCode
      message
      data {
        totalUsers
        totalEmployees
        totalManagers
        totalAdmins
        activeUsers
        inactiveUsers
        blockedUsers
        deletedUsers
        suspendedUsers
        verifiedUsers
        unverifiedUsers
        terminatedUsers
        resignedUsers
        retiredUsers
        onLeaveUsers
      }
    }
  }
`;
