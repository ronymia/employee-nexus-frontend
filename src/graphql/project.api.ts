import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query Projects {
    projects {
      message
      statusCode
      success
      data {
        id
        name
        description
        cover
        status
        startDate
        endDate
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query ProjectById($id: Int!) {
    projectById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        cover
        status
        startDate
        endDate
        businessId
        createdBy
        # projectMembers {
        #   id
        #   userId
        #   user {
        #     id
        #     email
        #     profile {
        #       fullName
        #     }
        #   }
        #   role
        #   joinedAt
        # }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String
    $cover: String!
    $status: String!
    $startDate: String
    $endDate: String
  ) {
    createProject(
      createProjectInput: {
        name: $name
        description: $description
        cover: $cover
        status: $status
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        cover
        status
        startDate
        endDate
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: Int!
    $name: String!
    $description: String
    $cover: String!
    $status: String!
    $startDate: String
    $endDate: String
  ) {
    updateProject(
      updateProjectInput: {
        id: $id
        name: $name
        description: $description
        cover: $cover
        status: $status
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        description
        cover
        status
        startDate
        endDate
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        cover
        status
        startDate
        endDate
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

export const ASSIGN_PROJECT_MEMBER = gql`
  mutation AssignProjectMember($projectId: Int!, $userId: Int!, $role: String) {
    assignProjectMember(projectId: $projectId, userId: $userId, role: $role) {
      message
      statusCode
      success
    }
  }
`;

export const UNASSIGN_PROJECT_MEMBER = gql`
  mutation UnassignProjectMember($projectId: Int!, $userId: Int!) {
    unassignProjectMember(projectId: $projectId, userId: $userId) {
      message
      statusCode
      success
    }
  }
`;
