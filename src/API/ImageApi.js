import axios from "axios";

// Define the base URL for your API
const API_URL = process.env.REACT_APP_API_URL;

// Function to upload an image
export const uploadImage = async (imageData, imageName, RSN, userId) => {
  // Create FormData object to send the image and additional data as a multipart form
  const formData = new FormData();
  formData.append("Image", imageData);
  formData.append("ImageName", imageName);
  formData.append("RSN", RSN);
  formData.append("UserId", userId);

  try {
    const response = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 5000, // Set timeout for the request
    });

    // Return response data (like a success message)
    return response.data;
  } catch (error) {
    // If an error occurs, log it and throw an error
    console.error("Error during image upload:", error);
    throw error;
  }
};

// Function to fetch image by RSN
export const getImageByRSN = async (RSN) => {
  try {
    if (!RSN) {
      throw new Error("RSN is required to fetch the image");
    }

    const response = await axios.get(`${API_URL}/image/${RSN}`);

    // Return the image data (either file path or base64 string)
    return response.data;
  } catch (error) {
    // Handle errors and log the issue
    console.error("Error fetching image:", error);

    // If the error response contains useful details, log them
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    throw error;
  }
};

// Function to update an image by RSN
export const updateImage = async (imageData, imageName, RSN, userId) => {
  const formData = new FormData();
  formData.append('Image', imageData);
  formData.append('ImageName', imageName);
  formData.append('UserId', userId);

  try {
    const response = await axios.put(`${API_URL}/update-image/${RSN}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.error("Error during image update:", error);
    throw error;
  }
};
