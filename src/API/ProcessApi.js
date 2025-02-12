import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Add a new process
export const addProcess = async (processData) => {
  try {
    console.log(processData);
    const response = await axios.post(`${API_URL}/add-process`, processData);
    return response.data;
  } catch (error) {
    console.error("Error adding process:", error);
    throw error.response?.data || error.message;
  }
};

// Update an existing process by RSN and ProcessName
export const updateProcess = async (RSN, ProcessName, updatedData) => {
  try {
    console.log(RSN);
    console.log(ProcessName);
    console.log(updatedData);
    const response = await axios.put(`${API_URL}/update-process/${RSN}/${ProcessName}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating process:", error);
    throw error.response?.data || error.message;
  }
};

// Search for a process by RSN
export const searchByRSN = async (RSN) => {
  try {
    const response = await axios.get(`${API_URL}/process/${RSN}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching process by RSN:", error);
    throw error.response?.data || error.message;
  }
};

// Delete a process by RSN and ProcessName
export const deleteProcess = async (RSN, ProcessName) => {
  console.log(RSN);
  console.log(ProcessName);
  try {
    const response = await axios.delete(`${API_URL}/delete-process/${RSN}/${ProcessName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting process:", error);
    throw error.response?.data || error.message;
  }
};
