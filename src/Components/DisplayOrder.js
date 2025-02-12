import React, { useState, useEffect } from "react";
import { getOrderDetails } from "../API/OrderApi";
import { useNavigate } from "react-router-dom";

const DisplayOrder = ({ orderNo }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderNo) {
      setError("Order number is required.");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setError(null);
        const response = await getOrderDetails(orderNo);

        if (
          response &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setOrderDetails(response.data[0]);
        } else {
          setError("No order details found");
          setOrderDetails(null);
        }
      } catch (err) {
        setError("An error occurred while fetching the order details");
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [orderNo]); // fetch when the orderNo changes or is provided

  const handleUpdate = () => {
    navigate("/update-order", { state: { orderDetails } });
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {orderDetails ? (
        <div>
          <h2>Order Details for Order No: {orderDetails.OrderNo}</h2>
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <thead>
              <tr>
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
              <tr key={orderDetails.OrderNo}>
                <td>{new Date(orderDetails.OrderDate).toLocaleString()}</td>
                <td>{orderDetails.OrderStatus}</td>
                <td>{orderDetails.Client}</td>
                <td>{orderDetails.ArticleNo}</td>
                <td>{new Date(orderDetails.DelieveryDate).toLocaleString()}</td>
                <td>{orderDetails.ApprovedBy}</td>
                <td>{new Date(orderDetails.Date).toLocaleString()}</td>
                <td>{orderDetails.UserId}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data found for this Order No.</p>
      )}

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default DisplayOrder;
