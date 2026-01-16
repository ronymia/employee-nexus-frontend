import { gql } from "@apollo/client";

export const GET_LEAVE_TYPES = gql`
  query LeaveTypes {
    leaveTypes {
      message
      statusCode
      success
      data {
        id
        name
        leaveType
        leaveMinutes
        leaveRolloverType
        carryOverLimit
        employmentStatuses {
          id
          name
        }
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_LEAVE_TYPE = gql`
  mutation CreateLeaveType(
    $name: String!
    $leaveType: LeaveTypeEnum!
    $leaveMinutes: Int!
    $leaveRolloverType: LeaveRolloverType!
    $carryOverLimit: Int
    $employmentStatuses: [Int!]!
  ) {
    createLeaveType(
      createLeaveTypeInput: {
        name: $name
        leaveType: $leaveType
        leaveMinutes: $leaveMinutes
        leaveRolloverType: $leaveRolloverType
        carryOverLimit: $carryOverLimit
        employmentStatuses: $employmentStatuses
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        leaveType
        leaveMinutes
        leaveRolloverType
        carryOverLimit
        employmentStatuses {
          id
          name
        }
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_LEAVE_TYPE = gql`
  mutation UpdateLeaveType(
    $id: Int!
    $name: String!
    $leaveType: LeaveTypeEnum!
    $leaveMinutes: Int!
    $leaveRolloverType: LeaveRolloverType!
    $carryOverLimit: Int
    $employmentStatuses: [Int!]!
  ) {
    updateLeaveType(
      updateLeaveTypeInput: {
        id: $id
        name: $name
        leaveType: $leaveType
        leaveMinutes: $leaveMinutes
        leaveRolloverType: $leaveRolloverType
        carryOverLimit: $carryOverLimit
        employmentStatuses: $employmentStatuses
      }
    ) {
      message
      statusCode
      success
      data {
        id
        name
        leaveType
        leaveMinutes
        leaveRolloverType
        carryOverLimit
        employmentStatuses {
          id
          name
        }
        businessId
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_LEAVE_TYPE = gql`
  mutation DeleteLeaveType($id: Int!) {
    deleteLeaveType(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;
