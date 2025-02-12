import React, { useState, useEffect } from "react";
import { getOrderByOrderNo } from "../API/OrderDetailsApi";

const ShowOrderDetails = ({ orderNo }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(orderNo);

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderByOrderNo(orderNo);
        if (response.data && Array.isArray(response.data)) {
          setOrderDetails(response.data);
        } else {
          setError("No order details found.");
        }
      } catch (err) {
        setError("Error fetching order details.");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);  // Set loading state to false after data is fetched
      }
    };

    if (orderNo) {
      fetchOrderDetails();
    }
  }, [orderNo]);  // Dependency array ensures this runs only when orderNo changes

  // Show loading indicator while fetching
  if (loading) {
    return <p>Loading order details...</p>;
  }

  // Show error if fetching fails
  if (error) {
    return <p>{error}</p>;
  }

  // Calculate totals for each size and the total quantity
  const calculateTotals = () => {
    const totals = {
      Freesize: 0,
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      "2XL": 0,
      "3XL": 0,
      "4XL": 0,
      "5XL": 0,
      Total: 0,
    };

    orderDetails.forEach(order => {
      if (order.Freesize != null) totals.Freesize += order.Freesize;
      if (order.XS != null) totals.XS += order.XS;
      if (order.S != null) totals.S += order.S;
      if (order.M != null) totals.M += order.M;
      if (order.L != null) totals.L += order.L;
      if (order.XL != null) totals.XL += order.XL;
      if (order["2XL"] != null) totals["2XL"] += order["2XL"];
      if (order["3XL"] != null) totals["3XL"] += order["3XL"];
      if (order["4XL"] != null) totals["4XL"] += order["4XL"];
      if (order["5XL"] != null) totals["5XL"] += order["5XL"];
      if (order.Total != null) totals.Total += order.Total;
    });

    return totals;
  };

  const totals = calculateTotals();

  // Render order details if available
  return (
    <div>
      <h2>Quantity Details</h2>
      {orderDetails.length > 0 ? (
        <table>
          <thead>
            <tr>
              {/* Define columns: Matching Name, Freesize, XS, S, L, ..., Total */}
              <th>Matching Name</th>
              {orderDetails.some(order => order.Freesize != null) && <th>Freesize</th>}
              {orderDetails.some(order => order.XS != null) && <th>XS</th>}
              {orderDetails.some(order => order.S != null) && <th>S</th>}
              {orderDetails.some(order => order.M != null) && <th>M</th>}
              {orderDetails.some(order => order.L != null) && <th>L</th>}
              {orderDetails.some(order => order.XL != null) && <th>XL</th>}
              {orderDetails.some(order => order["2XL"] != null) && <th>2XL</th>}
              {orderDetails.some(order => order["3XL"] != null) && <th>3XL</th>}
              {orderDetails.some(order => order["4XL"] != null) && <th>4XL</th>}
              {orderDetails.some(order => order["5XL"] != null) && <th>5XL</th>}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through each orderDetails item and display data in rows */}
            {orderDetails.map((order, index) => (
              <tr key={index}>
                <td>{order.MatchingName}</td>
                {order.Freesize != null && <td>{order.Freesize}</td>}
                {order.XS != null && <td>{order.XS}</td>}
                {order.S != null && <td>{order.S}</td>}
                {order.M != null && <td>{order.M}</td>}
                {order.L != null && <td>{order.L}</td>}
                {order.XL != null && <td>{order.XL}</td>}
                {order["2XL"] != null && <td>{order["2XL"]}</td>}
                {order["3XL"] != null && <td>{order["3XL"]}</td>}
                {order["4XL"] != null && <td>{order["4XL"]}</td>}
                {order["5XL"] != null && <td>{order["5XL"]}</td>}
                <td>{order.Total != null ? order.Total : "-"}</td>
              </tr>
            ))}
            {/* Row for displaying totals */}
            <tr>
              <td><strong>Totals</strong></td>
              {totals.Freesize !== 0 && <td><strong>{totals.Freesize}</strong></td>}
              {totals.XS !== 0 && <td><strong>{totals.XS}</strong></td>}
              {totals.S !== 0 && <td><strong>{totals.S}</strong></td>}
              {totals.M !== 0 && <td><strong>{totals.M}</strong></td>}
              {totals.L !== 0 && <td><strong>{totals.L}</strong></td>}
              {totals.XL !== 0 && <td><strong>{totals.XL}</strong></td>}
              {totals["2XL"] !== 0 && <td><strong>{totals["2XL"]}</strong></td>}
              {totals["3XL"] !== 0 && <td><strong>{totals["3XL"]}</strong></td>}
              {totals["4XL"] !== 0 && <td><strong>{totals["4XL"]}</strong></td>}
              {totals["5XL"] !== 0 && <td><strong>{totals["5XL"]}</strong></td>}
              <td><strong>{totals.Total}</strong></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No order details found.</p>
      )}
    </div>
  );
};

export default ShowOrderDetails;
