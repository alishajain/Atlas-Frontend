import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const addOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/add-order`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

const updateOrder = async (orderNo, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/update-order/${orderNo}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

const updateOrderStatus = async (orderNo, orderStatus) => {
  try {
    const response = await axios.put(`${API_URL}/update-order-status/${orderNo}`, { OrderStatus: orderStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

const deleteOrder = async (orderNo) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-order/${orderNo}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-orders`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving orders:', error);
    throw error;
  }
};

const getOrderNo = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-orderNo`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving order no:', error);
    throw error;
  }
};

const getOrderDetails = async (orderNo) => {
  try {
    const response = await axios.get(`${API_URL}/get-order/${orderNo}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving order details:', error);
    throw error;
  }
};

export {
  addOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getOrderDetails,
  getOrderNo,
};
