import React, { useState, useEffect } from "react";
import { searchOrderYarn } from "../API/OrderYarnApi";

const ShowOrderYarn = ({ orderNo }) => {
  const [orderYarnData, setOrderYarnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNo) return;

    const fetchOrderYarnData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await searchOrderYarn(orderNo);
        setOrderYarnData(response.data);
      } catch (err) {
        setError("Error fetching order yarn data");
        console.error("Error fetching order yarn data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderYarnData();
  }, [orderNo]);

  if (loading) {
    return <p>Loading order yarn data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Function to render yarn data with weight divided by 1000 and formatted to 2 decimals
  const renderYarnData = (yarn) => {
    return Object.keys(yarn)
      .filter((key) => key.startsWith("Yarn") && yarn[key]) // Filter out null yarns
      .map((key) => {
        const yarnItem = yarn[key];
        const weightInKg = (yarnItem.Weight / 1000).toFixed(2); // Divide by 1000 and fix to 2 decimals
        return (
          <tr key={key}>
            <td>{yarnItem.YarnId}</td>
            <td>{weightInKg} kg</td>
          </tr>
        );
      });
  };

  return (
    <div>
      {orderYarnData && orderYarnData.length > 0 ? (
        orderYarnData.map((order) => (
          <div key={order.OrderNo}>
            <h2>Yarn Requirement for Matching Name: {order.MatchingName}</h2>
            <table >
              <thead>
                <tr>
                  <th>Yarn ID</th>
                  <th>Total Weight (kg)</th>
                </tr>
              </thead>
              <tbody>{renderYarnData(order)}</tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No data found for this OrderNo.</p>
      )}
    </div>
  );
};

export default ShowOrderYarn;
