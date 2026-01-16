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
        status
        startDate
        endDate
        businessId
        createdBy
        projectMembers {
          id
          userId
          user {
            id
            email
            profile {
              fullName
            }
          }
          role
        }
        creator {
          id
          email
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

export const CREATE_PROJECT = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
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
  mutation UpdateProject($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
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
  mutation AssignProjectMember(
    $assignProjectMemberInput: AssignProjectMemberInput!
  ) {
    assignProjectMember(assignProjectMemberInput: $assignProjectMemberInput) {
      message
      statusCode
      success
      data {
        id
        projectId
        userId
        role
        createdAt
      }
    }
  }
`;

export const UNASSIGN_PROJECT_MEMBER = gql`
  mutation UnassignProjectMember(
    $unassignProjectMemberInput: UnassignProjectMemberInput!
  ) {
    unassignProjectMember(
      unassignProjectMemberInput: $unassignProjectMemberInput
    ) {
      message
      statusCode
      success
      data {
        id
        projectId
        userId
        role
      }
    }
  }
`;

export const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: Int!) {
    userProjects(userId: $userId) {
      success
      statusCode
      message
      data {
        id
        role
        projectId
        userId
        project {
          id
          name
          description
          status
          startDate
          endDate
          business {
            id
            name
          }
          creator {
            id
            email
            profile {
              fullName
            }
          }
          projectMembers {
            id
            role
            user {
              id
              email
              profile {
                fullName
              }
            }
          }
        }
        user {
          id
          email
          profile {
            fullName
          }
          role {
            id
            name
          }
        }
        createdAt
      }
      meta {
        total
      }
    }
  }
`;
