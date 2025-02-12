import React from "react";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();

  // Handle navigation on button click
  const handleNavigation = (path) => {
    navigate(path); 
  };

  return (
    <div>
      <h2>Order Management</h2>
      
      <div>
        <button onClick={() => handleNavigation("/search-orders")}>Show All Orders</button>
      </div>

      <div>
        <button onClick={() => handleNavigation("/add-order")}>Add New Order</button>
      </div>

      <div>
        <button onClick={() => handleNavigation("/home")}>Home</button>
      </div>
    </div>
  );
};

export default Order;
