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
        roleId
        status
        createdAt
        updatedAt
        profile {
          fullName
          address
          city
          country
          dateOfBirth
          gender
          maritalStatus
          phone
          postcode
          profilePicture
        }
        role {
          id
          name
        }
        employee {
          employeeId
          salary {
            salaryType
            salaryAmount
            startDate
          }
          designation {
            id
            name
          }
          department {
            id
            name
          }
          employmentStatus {
            id
            name
          }
          workSchedule {
            id
            name
          }
          workSites {
            id
            name
          }
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
        roleId
        status
        createdAt
        updatedAt
        role {
          id
          name
        }
        profile {
          fullName
          address
          city
          country
          dateOfBirth
          gender
          maritalStatus
          phone
          postcode
          profilePicture
          emergencyContact {
            name
            phone
            relation
          }
        }

        employee {
          employeeId
          nidNumber
          joiningDate
          salary {
            salaryType
            salaryAmount
            startDate
          }
          designation {
            id
            name
          }
          department {
            id
            name
          }
          employmentStatus {
            id
            name
          }
          workSchedule {
            id
            name
          }
          workSites {
            id
            name
          }
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

export const GET_EMPLOYMENT_DETAILS = gql`
  query GetEmploymentDetails($id: Int!) {
    getEmploymentDetails(id: $id) {
      message
      statusCode
      success
      data {
        userId
        employeeId
        nidNumber
        joiningDate
        salary {
          salaryType
          salaryAmount
          startDate
        }
        designation {
          id
          name
        }
        department {
          id
          name
        }
        employmentStatus {
          id
          name
        }
        workSchedule {
          id
          name
        }
        workSites {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
