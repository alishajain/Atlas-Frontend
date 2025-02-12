import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Function to fetch employee details
export const employeeDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/EmployeeDetails`);
    return response.data;
  } catch (error) {
    console.error("Error Fetching Employee Details", error);
    throw new Error("Error Fetching Employee Details");
  }
};

// Function to add a new employee
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/add-employee`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error("Failed to add employee. Please try again later.");
  }
};

// Function to search for employees
export const searchEmployee = async (empId, empName) => {
  try {
    const response = await axios.get(`${API_URL}/search-employee`, {
      params: {
        empId: empId || undefined, // Send undefined if the field is empty
        empName: empName || undefined, // Send undefined if the field is empty
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
    throw new Error("Error fetching employee details");
  }
};

// Function to delete an employee
export const deleteEmployee = async (empId) => {
  try {
    console.log(`Requesting DELETE for EmpId: ${empId}`);
    const response = await axios.delete(`${API_URL}/delete-employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Error deleting employee");
  }
};

// Function to update an employee
export const updateEmployee = async (updatedEmployee) => {
  try {
    // Make a PUT request to update the employee, passing EmpId in the URL
    const response = await fetch(
      `${API_URL}/update-employee/${updatedEmployee.EmpId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      }
    );

    // Directly await the JSON parsing
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error updating record");
    }
    return result;
  } catch (error) {
    throw new Error(error.message || "There was an error with the API request");
  }
};

// Function to fetch employee details
export const empId = async () => {
  try {
    const response = await axios.get(`${API_URL}/empId`);
    return response.data;
  } catch (error) {
    console.error("Error Fetching EmpId", error);
    throw new Error("Error Fetching EmpId");
  }
};
