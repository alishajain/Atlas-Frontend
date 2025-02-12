import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../API/OrderApi";
import OrderNoInput from "./OrderNoInput";

const SearchOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await getAllOrders();
        
        if (response && Array.isArray(response.data)) {
          setOrders(response.data[0]);
        } else {
          setError("No orders found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the orders.");
        console.error(err);
      }
    };

    fetchAllOrders();
  }, []);

  const handleBackButton = () => {
    navigate('/order');
  };

  return (
    <div>
      <OrderNoInput />
      <h2>All Orders</h2>

      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display orders in a table if they are available */}
      {orders.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Client</th>
              <th>Article No</th>
              <th>Delivery Date</th>
              <th>Approved By</th>
              <th>Date</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.OrderNo}>
                <td>{order.OrderNo}</td>
                <td>{new Date(order.OrderDate).toLocaleString()}</td>
                <td>{order.OrderStatus}</td>
                <td>{order.Client}</td>
                <td>{order.ArticleNo}</td>
                <td>{new Date(order.DelieveryDate).toLocaleString()}</td>
                <td>{order.ApprovedBy}</td>
                <td>{new Date(order.Date).toLocaleString()}</td>
                <td>{order.UserId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
      <button onClick={handleBackButton}>Back</button>
    </div>
  );
};

export default SearchOrders;
