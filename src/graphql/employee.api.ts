import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query Employees($query: QueryUserInput) {
    employees(query: $query) {
      message
      statusCode
      success
      data {
        id
        email
        businessId
        roleId
        status
        createdAt
        updatedAt
        profile {
          fullName
          phone
          dateOfBirth
          gender
          maritalStatus
          address
          city
          country
          postcode
          profilePicture
          emergencyContact {
            name
            phone
            relation
          }
        }
        role {
          id
          name
        }
        employee {
          userId
          employeeId
          nidNumber
          joiningDate
          salaryPerMonth
          workingDaysPerWeek
          workingHoursPerWeek
          designationId
          designation {
            id
            name
          }
          employmentStatusId
          employmentStatus {
            id
            name
          }
          departmentId
          department {
            id
            name
          }
          workSites {
            workSite {
              id
              name
            }
          }
          workScheduleId
          workSchedule {
            id
            name
          }
          rotaType
          createdAt
          updatedAt
        }
      }
      meta {
        page
        limit
        total
        totalPages
        skip
      }
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query EmployeeById($id: Int!) {
    employeeById(id: $id) {
      message
      statusCode
      success
      data {
        id
        email
        businessId
        roleId
        status
        createdAt
        updatedAt
        profile {
          userId
          fullName
          phone
          dateOfBirth
          gender
          address
          city
          country
          profilePicture
          maritalStatus
          postcode
          emergencyContact {
            name
            phone
            relation
          }
        }
        role {
          id
          name
        }
        employee {
          userId
          employeeId
          nidNumber
          joiningDate
          salaryPerMonth
          workingDaysPerWeek
          workingHoursPerWeek
          designationId
          designation {
            id
            name
          }
          employmentStatusId
          employmentStatus {
            id
            name
          }
          departmentId
          department {
            id
            name
          }
          workSites {
            workSite {
              id
              name
            }
          }
          workScheduleId
          workSchedule {
            id
            name
          }
          rotaType
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($createEmployeeInput: CreateEmployeeInput!) {
    createEmployee(createEmployeeInput: $createEmployeeInput) {
      message
      statusCode
      success
      data {
        id
        email
        businessId
        roleId
        status
        permissions
        createdAt
        updatedAt
        profile {
          fullName
          dateOfBirth
          gender
          maritalStatus
          phone
          address
          city
          country
          postcode
          profilePicture
          emergencyContact {
            name
            phone
            relation
          }
        }
        role {
          id
          name
        }
        employee {
          userId
          employeeId
          nidNumber
          joiningDate
          # salaryAmount
          # salaryType
          # salaryStartDate
          # designationId
          # designation {
          #   id
          #   name
          # }
          # employmentStatusId
          # employmentStatus {
          #   id
          #   name
          # }
          # departmentId
          # department {
          #   id
          #   name
          # }
          # workSites {
          #   workSite {
          #     id
          #     name
          #   }
          # }
          # workScheduleId
          # workSchedule {
          #   id
          #   name
          # }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($updateEmployeeInput: UpdateEmployeeInput!) {
    updateEmployee(updateEmployeeInput: $updateEmployeeInput) {
      message
      statusCode
      success
      data {
        id
        email
        businessId
        roleId
        status
        createdAt
        updatedAt
        profile {
          userId
          fullName
          dateOfBirth
          gender
          maritalStatus
          phone
          address
          city
          country
          postcode
          profilePicture
          emergencyContact {
            name
            phone
            relation
          }
        }
        role {
          id
          name
        }
        employee {
          userId
          employeeId
          nidNumber
          joiningDate
          salaryPerMonth
          workingDaysPerWeek
          workingHoursPerWeek
          designationId
          designation {
            id
            name
          }
          employmentStatusId
          employmentStatus {
            id
            name
          }
          departmentId
          department {
            id
            name
          }
          workSites {
            workSite {
              id
              name
            }
          }
          workScheduleId
          workSchedule {
            id
            name
          }
          rotaType
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: Int!) {
    deleteEmployee(id: $id) {
      message
      statusCode
      success
      data {
        id
      }
    }
  }
`;
