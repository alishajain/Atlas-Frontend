import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Function to add yarn usage
export const addYarnUsage = async (yarnUsageData) => {
  try {
    const response = await axios.post(`${API_URL}/add-yarn-usage`, yarnUsageData);
    return response.data;
  } catch (error) {
    console.error('Error adding yarn usage:', error);
    throw error;
  }
};

// Function to get yarn usage by ArticleNo
export const getYarnUsageByArticleNo = async (ArticleNo) => {
  try {
    const response = await axios.get(`${API_URL}/get-yarn-usage/${ArticleNo}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching yarn usage for ArticleNo ${ArticleNo}:`, error);
    throw error;
  }
};
