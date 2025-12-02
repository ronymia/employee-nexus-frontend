import { gql } from "@apollo/client";

// GET ALL LEAVES
export const GET_LEAVES = gql`
  query Leaves($query: QueryLeaveInput) {
    leaves(query: $query) {
      message
      statusCode
      success
      data {
        id
        userId
        leaveTypeId
        leaveYear
        leaveDuration
        startDate
        endDate
        totalHours
        status
        reviewedAt
        reviewedBy
        rejectionReason
        attachments
        notes
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        leaveType {
          id
          name
          #   isPaid
        }
        reviewer {
          id
          email
          profile {
            fullName
          }
        }
      }
    }
  }
`;

// GET LEAVE BY ID
export const GET_LEAVE_BY_ID = gql`
  query LeaveById($id: Int!) {
    leaveById(id: $id) {
      message
      statusCode
      success
      data {
        id
        userId
        leaveTypeId
        leaveYear
        leaveDuration
        startDate
        endDate
        totalHours
        status
        reviewedAt
        reviewedBy
        rejectionReason
        attachments
        notes
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        leaveType {
          id
          name
          #   isPaid
        }
        reviewer {
          id
          email
          profile {
            fullName
          }
        }
      }
    }
  }
`;

// CREATE LEAVE
export const CREATE_LEAVE = gql`
  mutation CreateLeave($createLeaveInput: CreateLeaveInput!) {
    createLeave(createLeaveInput: $createLeaveInput) {
      message
      statusCode
      success
      data {
        id
        userId
        leaveTypeId
        leaveYear
        leaveDuration
        startDate
        endDate
        totalHours
        status
        attachments
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

// UPDATE LEAVE
export const UPDATE_LEAVE = gql`
  mutation UpdateLeave($id: Int!, $updateLeaveInput: UpdateLeaveInput!) {
    updateLeave(id: $id, updateLeaveInput: $updateLeaveInput) {
      message
      statusCode
      success
      data {
        id
        userId
        leaveTypeId
        leaveYear
        leaveDuration
        startDate
        endDate
        totalHours
        status
        attachments
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

// DELETE LEAVE
export const DELETE_LEAVE = gql`
  mutation DeleteLeave($id: Int!) {
    deleteLeave(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// APPROVE/REJECT LEAVE
export const REVIEW_LEAVE = gql`
  mutation ReviewLeave($id: Int!, $status: String!, $rejectionReason: String) {
    reviewLeave(id: $id, status: $status, rejectionReason: $rejectionReason) {
      message
      statusCode
      success
      data {
        id
        status
        reviewedAt
        reviewedBy
        rejectionReason
      }
    }
  }
`;
