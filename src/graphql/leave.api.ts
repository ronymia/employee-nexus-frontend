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
export const LEAVE_REQUEST = gql`
  mutation CreateLeave($createLeaveInput: RequestLeaveInput!) {
    leaveRequest(createLeaveInput: $createLeaveInput) {
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
  mutation UpdateLeave($updateLeaveInput: UpdateLeaveInput!) {
    updateLeave(updateLeaveInput: $updateLeaveInput) {
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

// APPROVE LEAVE
export const APPROVE_LEAVE = gql`
  mutation ApproveLeave($leaveId: Int!) {
    approveLeave(leaveId: $leaveId) {
      message
      statusCode
      success
      data {
        id
        status
        updatedAt
      }
    }
  }
`;

// REJECT LEAVE
export const REJECT_LEAVE = gql`
  mutation RejectLeave($leaveId: Int!) {
    rejectLeave(leaveId: $leaveId) {
      message
      statusCode
      success
      data {
        id
        status
        updatedAt
      }
    }
  }
`;

// LEAVE BALANCE
export const LEAVE_BALANCE = gql`
  query LeaveBalance($leaveTypeId: Int!, $userId: Int!, $year: Int!) {
    leaveBalance(leaveTypeId: $leaveTypeId, userId: $userId, year: $year) {
      success
      statusCode
      message
      data {
        leaveTypeId
        leaveTypeName
        year
        allocatedHours
        usedHours
        remainingHours
      }
    }
  }
`;
