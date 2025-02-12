import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to check if an EmpID already exists
export const checkIfEmpIDExists = async (empID) => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    // Check if any user has the same EmpID
    const userExists = users.some(user => user.EmpID === empID);
    return userExists;
  } catch (error) {
    console.error("Error checking EmpID:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Function to get all users (admin functionality)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};
