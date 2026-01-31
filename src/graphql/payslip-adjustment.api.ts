import { gql } from "@apollo/client";

export const CREATE_PAYSLIP_ADJUSTMENT = gql`
  mutation CreatePayslipAdjustment(
    $createPayslipAdjustmentInput: CreatePayslipAdjustmentInput!
  ) {
    createPayslipAdjustment(
      createPayslipAdjustmentInput: $createPayslipAdjustmentInput
    ) {
      success
      statusCode
      message
      data {
        id
        userId
        user {
          id
          email
          profile {
            fullName
            phone
          }
        }
        payrollItemId
        payrollComponentId
        payrollComponent {
          id
          name
          code
          componentType
          calculationType
        }
        remarks
        value
        appliedMonth
        status
        requestedBy
        requestedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedBy
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PAYSLIP_ADJUSTMENT = gql`
  mutation UpdatePayslipAdjustment(
    $updatePayslipAdjustmentInput: UpdatePayslipAdjustmentInput!
  ) {
    updatePayslipAdjustment(
      updatePayslipAdjustmentInput: $updatePayslipAdjustmentInput
    ) {
      success
      statusCode
      message
      data {
        id
        userId
        payrollComponentId
        remarks
        value
        status
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

export const APPROVE_PAYSLIP_ADJUSTMENT = gql`
  mutation ApproveRejectPayslipAdjustment(
    $approveRejectPayslipAdjustmentInput: ApproveRejectPayslipAdjustmentInput!
  ) {
    approveRejectPayslipAdjustment(
      approveRejectPayslipAdjustmentInput: $approveRejectPayslipAdjustmentInput
    ) {
      success
      statusCode
      message
      data {
        id
        status
        reviewedBy
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        notes
      }
    }
  }
`;

export const REJECT_PAYSLIP_ADJUSTMENT = gql`
  mutation ApproveRejectPayslipAdjustment(
    $approveRejectPayslipAdjustmentInput: ApproveRejectPayslipAdjustmentInput!
  ) {
    approveRejectPayslipAdjustment(
      approveRejectPayslipAdjustmentInput: $approveRejectPayslipAdjustmentInput
    ) {
      success
      statusCode
      message
      data {
        id
        status
        reviewedBy
        appliedMonth
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        notes
      }
    }
  }
`;

export const GET_PAYSLIP_ADJUSTMENTS = gql`
  query PayslipAdjustments($query: QueryPayslipAdjustmentInput) {
    payslipAdjustments(query: $query) {
      success
      statusCode
      message
      data {
        id
        userId
        user {
          id
          email
          profile {
            fullName
          }
        }
        payrollComponentId
        payrollComponent {
          id
          name
          code
        }
        remarks
        value
        status
        requestedBy
        appliedMonth
        notes
        requestedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedBy
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PAYSLIP_ADJUSTMENT_BY_ID = gql`
  query PayslipAdjustment($id: Int!) {
    payslipAdjustment(id: $id) {
      success
      statusCode
      message
      data {
        id
        userId
        user {
          id
          email
          profile {
            fullName
            phone
          }
        }
        payrollComponentId
        payrollComponent {
          id
          name
          code
          calculationType
        }
        remarks
        value
        status
        appliedMonth
        requestedBy
        requestedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedBy
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        notes
        createdAt
        updatedAt
      }
    }
  }
`;

export const PENDING_PAYSLIP_ADJUSTMENT_BY_ID = gql`
  query PendingPayslipAdjustments($query: QueryPayslipAdjustmentInput) {
    pendingPayslipAdjustments(query: $query) {
      success
      statusCode
      message
      data {
        id
        userId
        user {
          id
          email
          profile {
            fullName
          }
        }
        payrollComponentId
        remarks
        value
        status
        requestedBy
        createdAt
      }
    }
  }
`;

export const APPROVED_PAYSLIP_ADJUSTMENTS = gql`
  query ApprovedPayslipAdjustments($query: QueryPayslipAdjustmentInput) {
    approvedPayslipAdjustments(query: $query) {
      success
      statusCode
      message
      data {
        id
        userId
        user {
          id
          email
          profile {
            fullName
          }
        }
        payrollComponentId
        payrollComponent {
          name
          code
        }
        remarks
        value
        status
        reviewedBy
        reviewedByUser {
          id
          email
          profile {
            fullName
          }
        }
        reviewedAt
        createdAt
      }
    }
  }
`;
