import { gql } from "@apollo/client";

export const GET_DEPARTMENTS = gql`
  query Departments {
    departments {
      message
      statusCode
      success
      data {
        id
        parentId
        parent {
          id
          name
        }
        name
        description
        status
        businessId
        managerId
        manager {
          id
          profile {
            fullName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($createDepartmentInput: CreateDepartmentInput!) {
    createDepartment(createDepartmentInput: $createDepartmentInput) {
      message
      statusCode
      success
      data {
        id
        parentId
        parent {
          id
          name
        }
        name
        description
        status
        businessId
        managerId
        manager {
          id
          profile {
            fullName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($updateDepartmentInput: UpdateDepartmentInput!) {
    updateDepartment(updateDepartmentInput: $updateDepartmentInput) {
      message
      statusCode
      success
      data {
        id
        parentId
        parent {
          id
          name
        }
        name
        description
        status
        businessId
        managerId
        manager {
          id
          profile {
            fullName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: Int!) {
    deleteDepartment(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// Users query for manager selection
export const GET_MANAGERS = gql`
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
      }
    }
  }
`;
