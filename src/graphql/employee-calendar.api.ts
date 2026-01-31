import { gql } from "@apollo/client";

// ==================== EMPLOYEE CALENDAR QUERY ====================
/**
 * Employee Calendar API
 * Returns employee attendance dates, leave dates, and holiday dates in a single query
 *
 * Required Permission: User:read
 *
 * Query Parameters (Optional):
 * - userId (Int): The employee user ID. If not provided, returns data for the current logged-in user.
 * - startDate (String): Start date in format DD-MM-YYYY
 * - endDate (String): End date in format DD-MM-YYYY
 * - year (Int): Year filter (e.g., 2026)
 * - month (Int): Month filter (1-12)
 *
 * Date Range Logic:
 * 1. If startDate and endDate are provided, returns data for that range
 * 2. If year and month are provided, returns data for that specific month
 * 3. If only year is provided, returns data for the entire year
 * 4. If no dates are provided, returns data for the current year
 */
export const GET_EMPLOYEE_CALENDAR = gql`
  query EmployeeCalendar($query: QueryEmployeeCalendarInput) {
    employeeCalendar(query: $query) {
      success
      statusCode
      message
      data {
        joiningDate
        registrationDate
        attendances {
          date
          status
          totalMinutes
          breakMinutes
          overtimeMinutes
        }
        leaves {
          startDate
          endDate
          status
          leaveDuration
          totalMinutes
        }
        holidays {
          startDate
          endDate
          name
          description
          isPaid
          holidayType
          isRecurring
        }
      }
    }
  }
`;
