import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Add Yarn Details - Insert new Yarn into yarn_master
export const addYarnDetails = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add-yarn`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data; // Return response data to the caller
  } catch (error) {
    // Enhanced error handling with more specific details
    console.error("API call error:", error);

    // Check if the error has a response (e.g., 404, 500)
    if (error.response) {
      console.error("Response error:", error.response.data);
      throw new Error(
        `Error: ${error.response.status} - ${error.response.data}`
      );
    }
    // Check if the error is due to network issues or no response
    else if (error.request) {
      console.error("Request error:", error.request);
      throw new Error("No response received from the API");
    }
    // For other types of errors (e.g., misconfiguration)
    else {
      console.error("Error message:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Fetch Yarn IDs for the dropdown
export const getYarnIds = async () => {
  try {
    const response = await axios.get(`${API_URL}/yarnId`);
    return response.data;
  } catch (error) {
    console.error("Error fetching YarnIds:", error);
    throw new Error("Error fetching YarnIds");
  }
};

// API function to insert Yarn stock details and update YarnMaster table
export const addYarnStockDetails = async (data) => {
  try {
    console.log("Sending data to API:", data);

    const stockResponse = await axios.post(`${API_URL}/add-yarn-stock`, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Received API response:", stockResponse);

    // Check if success status is true
    if (stockResponse.data && stockResponse.data.success) {
      const { YarnId, Weight } = data;
      return {
        success: true,
        message: "Yarn stock added successfully and yarn master updated.",
      };
    } else {
      throw new Error("Error adding yarn stock details");
    }
  } catch (error) {
    console.error("API call error:", error);

    if (error.response) {
      console.error("Response error:", error.response.data);
      throw new Error(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      console.error("Request error:", error.request);
      throw new Error("No response received from the API");
    } else {
      console.error("Error message:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// API function to fetch Yarn details grouped by LotNo
export const getYarnDetailsByLotNo = async (YarnId) => {
  try {
    // Sending a GET request to fetch the yarn details grouped by LotNo
    const response = await axios.get(`${API_URL}/yarn/${YarnId}`);

    // Returning the response data to the caller
    return response.data;
  } catch (error) {
    console.error("Error fetching yarn details by LotNo:", error);

    // Handle different error scenarios
    if (error.response) {
      console.error("Response error:", error.response.data);
      throw new Error(
        `Error: ${error.response.status} - ${error.response.data}`
      );
    } else if (error.request) {
      console.error("Request error:", error.request);
      throw new Error("No response received from the API");
    } else {
      console.error("Error message:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};
