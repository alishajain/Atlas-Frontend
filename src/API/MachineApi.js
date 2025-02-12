import axios from "axios";

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL;

// Function to add a new machine
export const addMachine = async (machineData) => {
  try {
    const response = await axios.post(`${API_URL}/add-machine`, machineData);
    return response.data;
  } catch (error) {
    // Improved error logging
    console.error(
      "Error adding machine:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error adding machine");
  }
};

// Function to search a machine by MachineNo
export const searchMachineByMachineNo = async (MachineNo) => {
  try {
    const response = await axios.get(`${API_URL}/search-machine/${MachineNo}`);
    return response.data;
  } catch (error) {
    // Improved error logging
    console.error(
      "Error searching machine:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error searching machine");
  }
};

// Function to update a machine by MachineNo
export const updateMachineByMachineNo = async (MachineNo, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/update-machine/${MachineNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating machine');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      'Error updating machine:',
      error.response ? error.response.data : error.message
    );
    throw new Error('Error updating machine');
  }
};

// Function to get all machines
export const getAllMachines = async () => {
  try {
    const response = await axios.get(`${API_URL}/machines`);
    return response.data; // Assume the response data contains the machines
  } catch (error) {
    // Enhanced error logging
    console.error(
      "Error fetching all machines:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching all machines");
  }
};

// Function to delete a machine by its MachineNo
export const deleteMachine = async (machineNo) => {
  try {
    const response = await axios.delete(
      `${API_URL}/delete-machine/${machineNo}`
    );
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error(
      "Error deleting machine:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error deleting machine");
  }
};
