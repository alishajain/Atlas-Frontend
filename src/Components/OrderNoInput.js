import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderNoInput = () => {
  const [orderNo, setOrderNo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderNo.trim() === "") {
      alert("Please enter a valid orderNo");
      return;
    }
    navigate(`/show-order/${orderNo}`, { state: { orderNo: orderNo } });
  };

  return (
    <div>
      <h1>Enter orderNo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orderNo">Enter orderNo:</label>
          <input
            type="text"
            id="orderNo"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Enter orderNo to fetch details"
            required
          />
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default OrderNoInput;
