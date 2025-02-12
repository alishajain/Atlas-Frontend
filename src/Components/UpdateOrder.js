import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateOrder } from "../API/OrderApi";

const UpdateOrder = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  const [orderDetails, setOrderDetails] = useState(
    state ? state.orderDetails : {}
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state || !state.orderDetails) {
      navigate("/");
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
      UserId: userId,
    }));
  };

  const formatDateForMySQL = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleUpdate = async () => {
    try {
      // Format dates before sending them
      const formattedOrderDetails = {
        ...orderDetails,
        OrderDate: formatDateForMySQL(orderDetails.OrderDate),
        DelieveryDate: formatDateForMySQL(orderDetails.DelieveryDate),
        Date: formatDateForMySQL(orderDetails.Date),
      };

      // Call the update API
      const response = await updateOrder(
        orderDetails.OrderNo,
        formattedOrderDetails
      );

      if (response && response.success) {
        window.alert(
          `Order No ${orderDetails.OrderNo} has been updated successfully.`
        );
        navigate("/order");
      } else {
        setError("Failed to update the order");
      }
    } catch (err) {
      setError("An error occurred while updating the order");
      console.error(err);
    }
  };

  console.log(orderDetails);
  return (
    <div>
      <h2>Update Order</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Order No</label>
        <input
          type="text"
          name="OrderNo"
          value={orderDetails.OrderNo}
          disabled
        />
      </div>

      <div>
        <label>Order Date</label>
        <input
          type="datetime-local"
          name="OrderDate"
          value={new Date(orderDetails.OrderDate).toISOString().slice(0, 16)}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Order Status</label>
        <input
          type="text"
          name="OrderStatus"
          value={orderDetails.OrderStatus}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Client</label>
        <input
          type="text"
          name="Client"
          value={orderDetails.Client}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Article No</label>
        <input
          type="text"
          name="ArticleNo"
          value={orderDetails.ArticleNo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Delivery Date</label>
        <input
          type="datetime-local"
          name="DelieveryDate"
          value={new Date(orderDetails.DelieveryDate)
            .toISOString()
            .slice(0, 16)}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Approved By</label>
        <input
          type="text"
          name="ApprovedBy"
          value={orderDetails.ApprovedBy}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdateOrder;
