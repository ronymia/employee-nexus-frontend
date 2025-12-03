import { gql } from "@apollo/client";

// GET ALL HOLIDAYS
export const GET_HOLIDAYS = gql`
  query Holidays($query: QueryHolidayInput) {
    holidays(query: $query) {
      message
      statusCode
      success
      data {
        id
        name
        description
        startDate
        endDate
        isRecurring
        isPaid
        holidayType
        businessId
        createdBy
        createdAt
        updatedAt
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
      }
    }
  }
`;

// GET HOLIDAY BY ID
export const GET_HOLIDAY_BY_ID = gql`
  query HolidayById($id: Int!) {
    holidayById(id: $id) {
      message
      statusCode
      success
      data {
        id
        name
        description
        startDate
        endDate
        isRecurring
        isPaid
        holidayType
        businessId
        createdBy
        createdAt
        updatedAt
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
      }
    }
  }
`;

// CREATE HOLIDAY
export const CREATE_HOLIDAY = gql`
  mutation CreateHoliday($createHolidayInput: CreateHolidayInput!) {
    createHoliday(createHolidayInput: $createHolidayInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        startDate
        endDate
        isRecurring
        isPaid
        holidayType
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

// UPDATE HOLIDAY
export const UPDATE_HOLIDAY = gql`
  mutation UpdateHoliday($updateHolidayInput: UpdateHolidayInput!) {
    updateHoliday(updateHolidayInput: $updateHolidayInput) {
      message
      statusCode
      success
      data {
        id
        name
        description
        startDate
        endDate
        isRecurring
        isPaid
        holidayType
        businessId
        createdBy
        createdAt
        updatedAt
      }
    }
  }
`;

// DELETE HOLIDAY
export const DELETE_HOLIDAY = gql`
  mutation DeleteHoliday($id: Int!) {
    deleteHoliday(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;
