import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Adds Sample details
export const addSampleDetails = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-sample`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // Return response data to the caller
  } catch (error) {
    // Enhanced error handling with more specific details
    console.error('API call error:', error);

    // Check if the error has a response (e.g., 404, 500)
    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(`Error: ${error.response.status} - ${error.response.data}`);
    }
    // Check if the error is due to network issues or no response
    else if (error.request) {
      console.error('Request error:', error.request);
      throw new Error('No response received from the API');
    }
    // For other types of errors (e.g., misconfiguration)
    else {
      console.error('Error message:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Adds Knitting Details
export const addKnittingDetails = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-knitting`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Check for a successful response (e.g., status 200)
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Unexpected response status: ' + response.status);
    }
  } catch (error) {
    // Enhanced error handling with more specific details
    console.error('API call error:', error);

    // Check if the error has a response (e.g., 404, 500)
    if (error.response) {
      console.error('Response error:', error.response.data);
      return { success: false, message: `Error: ${error.response.status} - ${error.response.data}` };
    }
    // Check if the error is due to network issues or no response
    else if (error.request) {
      console.error('Request error:', error.request);
      return { success: false, message: 'No response received from the API' };
    }
    // For other types of errors (e.g., misconfiguration)
    else {
      console.error('Error message:', error.message);
      return { success: false, message: error.message };
    }
  }
};

// Updates Sample details
export const updateRecord = async (data) => {
  try {
    const response = await fetch(`${API_URL}/update-sample`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error updating record');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'There was an error with the API request');
  }
};

// Fetch sample details by RSN
export const getSampleDetailsByRSN = async (RSN) => {
  if (!RSN) {
    throw new Error('RSN is required');
  }

  try {
    const url = `${API_URL}/sample-details/${RSN}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching sample details:', error.response || error.message);
    throw error;
  }
};

// Fetch knitting details by RSN
export const getKnittingDetailsByRSN = async (RSN) => {
  if (!RSN) {
    throw new Error('RSN is required');
  }

  try {
    const url = `${API_URL}/knitting-details/${RSN}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching knitting details:', error.response || error.message);
    throw error;
  }
};

// Function to update the knitting details
export const updateKnittingDetails = async (RSN, knittingData) => {
  if (!RSN || !knittingData) {
    throw new Error('RSN and knittingData are required');
  }

  const url = `${API_URL}/update-knitting-details/${RSN}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(knittingData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to update knitting details: ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Failed to parse response data');
  }

  return data;
};

// Function to fetch the latest RSN
export const getLatestRSN = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-latest-rsn`);
    return response.data.RSN;  // Assuming response contains the latest RSN number
  } catch (error) {
    console.error('Error fetching latest RSN:', error.response || error.message);
    throw error;
  }
};

// New function to fetch unique ModelNos
export const getMachineNos = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-machineNo`);
    return response.data;
  } catch (error) {
    console.error('Error fetching model numbers:', error.response || error.message);
    throw error;
  }
};

// Delete Sample Record by RSN
export const deleteSample = async (RSN) => {
  if (!RSN) {
    throw new Error('RSN is required');
  }

  try {
    const response = await axios.delete(`${API_URL}/delete-sample/${RSN}`); 
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Unexpected response status: ' + response.status);
    }
  } catch (error) {
    console.error('Error deleting sample record:', error.response || error.message);


    if (error.response) {
      console.error('Response error:', error.response.data);
      return { success: false, message: `Error: ${error.response.status} - ${error.response.data}` };
    }
    // Check if the error is due to network issues or no response
    else if (error.request) {
      console.error('Request error:', error.request);
      return { success: false, message: 'No response received from the API' };
    }
    // For other types of errors (e.g., misconfiguration)
    else {
      console.error('Error message:', error.message);
      return { success: false, message: error.message };
    }
  }
};

export const getSize = async (RSN) => {
  try {
    const response = await axios.get(`${API_URL}/get-size/${RSN}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching knitting size:', error.response || error.message);
    throw error;
  }
};

export const sampleList = async () => {
  try {
    const response = await axios.get(`${API_URL}/SampleList`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sample list:', error.response || error.message);
    throw error;
  }
};