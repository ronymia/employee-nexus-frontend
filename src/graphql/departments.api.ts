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
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment(
    $name: String!
    $description: String!
    $parentId: Int
    $managerId: Int
  ) {
    createDepartment(
      createDepartmentInput: {
        name: $name
        description: $description
        parentId: $parentId
        managerId: $managerId
      }
    ) {
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
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment(
    $id: Int!
    $name: String!
    $description: String!
    $parentId: Int
    $managerId: Int
  ) {
    updateDepartment(
      updateDepartmentInput: {
        id: $id
        name: $name
        description: $description
        parentId: $parentId
        managerId: $managerId
      }
    ) {
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
        createdBy
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
export const GET_USERS = gql`
  query Users {
    users {
      message
      statusCode
      success
      data {
        id
        name
        email
        profile {
          fullName
        }
      }
    }
  }
`;
