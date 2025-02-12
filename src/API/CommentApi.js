import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Function to get comments for a specific RSN
export const getCommentsByRSN = async (RSN) => {
  try {
    const response = await axios.get(`${API_URL}/comments/${RSN}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

// Function to add a new comment
export const addComment = async (RSN, userId, comment) => {
  try {
    const data = { RSN, UserId: userId, Comments: comment };
    const response = await axios.post(`${API_URL}/comments`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};
