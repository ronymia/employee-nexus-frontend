import { gql } from "@apollo/client";

// GET ALL ATTENDANCES
export const GET_ATTENDANCES = gql`
  query Attendances($query: QueryAttendanceInput) {
    attendances(query: $query) {
      message
      statusCode
      success
      data {
        id
        userId
        date
        totalMinutes
        breakMinutes
        scheduleMinutes
        overtimeMinutes
        status
        type
        reviewedAt
        reviewedBy
        reviewer {
          id
          email
          profile {
            fullName
          }
        }
        remarks
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        punchRecords {
          id
          attendanceId
          projectId
          project {
            id
            name
          }
          workSiteId
          workSite {
            id
            name
          }
          punchIn
          punchOut
          workMinutes
          breakMinutes
          punchInIp
          punchOutIp
          punchInLat
          punchInLng
          punchOutLat
          punchOutLng
          punchInDevice
          punchOutDevice
          notes
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// GET ATTENDANCE BY ID
export const GET_ATTENDANCE_BY_ID = gql`
  query AttendanceById($id: Int!) {
    attendanceById(id: $id) {
      message
      statusCode
      success
      data {
        id
        userId
        date
        scheduleMinutes
        totalMinutes
        breakMinutes
        status
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        punchRecords {
          id
          attendanceId
          projectId
          workSiteId
          punchIn
          punchOut
          breakStart
          breakEnd
          workMinutes
          breakMinutes
          punchInIp
          punchOutIp
          punchInLat
          punchInLng
          punchOutLat
          punchOutLng
          punchInDevice
          punchOutDevice
          notes
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// CREATE ATTENDANCE
export const ATTENDANCE_REQUEST = gql`
  mutation RequestAttendance($requestAttendanceInput: RequestAttendanceInput!) {
    requestAttendance(requestAttendanceInput: $requestAttendanceInput) {
      message
      statusCode
      success
      data {
        id
        userId
        date
        status
        createdAt
        updatedAt
        punchRecords {
          id
          punchIn
          punchOut
          notes
        }
      }
    }
  }
`;

// CREATE ATTENDANCE
export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($createAttendanceInput: CreateAttendanceInput!) {
    createAttendance(createAttendanceInput: $createAttendanceInput) {
      message
      statusCode
      success
      data {
        id
        userId
        date
        totalMinutes
        breakMinutes
        status
        createdAt
        updatedAt
        punchRecords {
          id
          punchIn
          punchOut
          workMinutes
          breakMinutes
          notes
        }
      }
    }
  }
`;

// UPDATE ATTENDANCE
export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($updateAttendanceInput: UpdateAttendanceInput!) {
    updateAttendance(updateAttendanceInput: $updateAttendanceInput) {
      message
      statusCode
      success
      data {
        id
        # userId
        date
        totalMinutes
        breakMinutes
        status
        createdAt
        updatedAt
      }
    }
  }
`;

// DELETE ATTENDANCE
export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: Int!) {
    deleteAttendance(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;

// APPROVE ATTENDANCE
export const APPROVE_ATTENDANCE = gql`
  mutation ApproveAttendance($approveAttendanceInput: ApproveAttendanceInput!) {
    approveAttendance(approveAttendanceInput: $approveAttendanceInput) {
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

// REJECT ATTENDANCE
export const REJECT_ATTENDANCE = gql`
  mutation RejectAttendance($rejectAttendanceInput: RejectAttendanceInput!) {
    rejectAttendance(rejectAttendanceInput: $rejectAttendanceInput) {
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

// ==================== ATTENDANCE SUMMARY ====================
export const ATTENDANCE_SUMMARY = gql`
  query AttendanceSummary(
    $startDate: DateTime
    $endDate: DateTime
    $userId: Int
  ) {
    attendanceSummary(
      startDate: $startDate
      endDate: $endDate
      userId: $userId
    ) {
      success
      statusCode
      message
      data {
        pending
        approved
        rejected
        absent
        late
        halfDay
      }
    }
  }
`;

// ==================== ATTENDANCE OVERVIEW ====================
export const ATTENDANCE_OVERVIEW = gql`
  query AttendanceOverview {
    attendanceOverview {
      success
      statusCode
      message
      data {
        total
        pending
        approved
        rejected
        absent
        late
        partial
      }
    }
  }
`;
