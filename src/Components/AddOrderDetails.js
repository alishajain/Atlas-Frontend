import React, { useState, useEffect } from "react";
import { getYarnUsageByArticleNo } from "../API/YarnUsageApi";
import { getOrderNo } from "../API/OrderApi";
import { addOrderDetails } from "../API/OrderDetailsApi";
import { addOrderYarn } from "../API/OrderYarnApi";
import { useSelector } from "react-redux";

const sizes = [
  "Freesize",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
];

const AddOrderDetails = ({ ArticleNo }) => {
  const userId = useSelector((state) => state.user.userId);

  const [yarnUsageData, setYarnUsageData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [updatedYarnUsageData, setUpdatedYarnUsageData] = useState([]);
  const [orderNo, setOrderNo] = useState(null);

  // Fetch Order No on component load
  useEffect(() => {
    const fetchOrderNo = async () => {
      try {
        const { OrderNo } = await getOrderNo();
        setOrderNo(OrderNo);
      } catch (err) {
        setError("Failed to fetch Order No.");
      }
    };

    fetchOrderNo();
  }, []);

  // Fetch Yarn Usage data based on ArticleNo
  useEffect(() => {
    const fetchYarnUsage = async () => {
      if (!ArticleNo) return;
      setLoading(true);
      try {
        const response = await getYarnUsageByArticleNo(ArticleNo);
        if (response.success && response.data.length > 0) {
          setYarnUsageData(response.data);
        } else {
          setError("No yarn usage data found.");
        }
      } catch (err) {
        setError("Failed to fetch yarn usage data.");
      } finally {
        setLoading(false);
      }
    };

    fetchYarnUsage();
  }, [ArticleNo]);

  const getNonNullSizes = (data) => {
    if (Array.isArray(data)) {
      return sizes.filter((size) => data.some((row) => row[size] !== null));
    }
    return sizes.filter((size) => data[size] !== null);
  };

  const handleQuantityChange = (matchingName, size, value) => {
    const quantity = parseInt(value) || 0;
    setQuantities((prev) => {
      const updatedQuantities = {
        ...prev,
        [matchingName]: {
          ...prev[matchingName],
          [size]: quantity,
        },
      };
      return updatedQuantities;
    });
  };

  const calculateTotalQuantity = (matchingName) => {
    const quantitiesForMatchingName = quantities[matchingName] || {};
    return getNonNullSizes(yarnUsageData).reduce(
      (total, size) => total + (quantitiesForMatchingName[size] || 0),
      0
    );
  };

  const getNonNullYarns = (data) => {
    return Array.from({ length: 15 }, (_, i) => {
      const yarnKey = `Yarn${i + 1}`;
      if (data[yarnKey]?.YarnId) {
        return {
          YarnId: data[yarnKey].YarnId,
          Weight: data[yarnKey].Weight,
        };
      }
      return null;
    }).filter(Boolean);
  };

  const calculateUpdatedWeight = (originalWeight, size, matchingName) => {
    const quantity = quantities[matchingName]?.[size];
    if (quantity <= 0) return 0;

    const row = yarnUsageData.find((row) => row.MatchingName === matchingName);
    const percentage = row ? row[size] : 0;

    const weight = originalWeight * (1 + percentage / 100) * quantity;
    return weight > 0 ? weight : 0;
  };

  // Pre-calculate yarn details whenever quantities change
  useEffect(() => {
    if (yarnUsageData.length > 0 && Object.keys(quantities).length > 0) {
      const updatedData = yarnUsageData.map((data) => {
        const yarns = getNonNullYarns(data);
        const updatedYarns = yarns.reduce((acc, yarn, index) => {
          const updatedYarnDetails = {};
          let totalWeight = 0;

          // Perform calculation for each size based on updated quantities
          getNonNullSizes(data).forEach((size) => {
            const updatedWeight = calculateUpdatedWeight(
              yarn.Weight,
              size,
              data.MatchingName
            );
            updatedYarnDetails[size] = updatedWeight;
            totalWeight += updatedWeight;
          });

          // Assign the total weight to each yarn
          acc[`Yarn${index + 1}`] = {
            YarnId: yarn.YarnId,
            Weight: totalWeight, // Store the total weight here
            ...updatedYarnDetails, // Store individual weights for display
          };

          return acc;
        }, {});

        return {
          MatchingName: data.MatchingName,
          UserId: userId,
          OrderNo: orderNo,
          ...updatedYarns,
        };
      });

      setUpdatedYarnUsageData(updatedData); // Update the state with the pre-calculated data
    }
  }, [quantities, yarnUsageData, userId, orderNo]);

  const addYarnHandler = async () => {
    if (updatedYarnUsageData.length === 0) {
      setError("No updated yarn usage data available.");
      return;
    }

    try {
      for (const data of updatedYarnUsageData) {
        const orderYarnData = {
          MatchingName: data.MatchingName,
          UserId: data.UserId,
          OrderNo: data.OrderNo,
          ...Object.keys(data)
            .filter((key) => key.startsWith("Yarn")) // Filter only yarn-related keys
            .reduce((acc, key) => {
              acc[key] = {
                YarnId: data[key].YarnId,
                Weight: data[key].Weight, // Only send the total weight
              };
              return acc;
            }, {}),
        };

        // Send only the total weight for each yarn to the API
        await addOrderYarn(orderYarnData);
      }

      alert("Yarn details added successfully!");
    } catch (err) {
      setError("Failed to add yarn request.");
    }
  };

  const addOrderDetailsHandler = async () => {
    if (!orderNo) {
      setError("Order No is not available.");
      return;
    }

    try {
      for (const data of yarnUsageData) {
        const matchingName = data.MatchingName;

        const orderDetails = {
          OrderNo: orderNo,
          MatchingName: matchingName,
          UserId: userId,
          Total: calculateTotalQuantity(matchingName),
          ...getNonNullSizes(data).reduce((acc, size) => {
            acc[size] = quantities[matchingName]?.[size] || 0;
            return acc;
          }, {}),
        };

        await addOrderDetails(orderDetails);
      }

      alert("Order details added successfully!");
    } catch (err) {
      setError("Failed to add order details.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const nonNullSizes = getNonNullSizes(yarnUsageData);

  return (
    <div>
      <h2>
        Order Quantity Details for Article No: {ArticleNo} with RSN:{" "}
        {yarnUsageData[0]?.RSN}
      </h2>

      {yarnUsageData.length ? (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Matching Name</th>
              {nonNullSizes.map((size) => (
                <th key={size}>{size}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {yarnUsageData.map((data, dataIndex) => (
              <tr key={dataIndex}>
                <td>{data.MatchingName}</td>
                {nonNullSizes.map((size) => (
                  <td key={size}>
                    <input
                      type="number"
                      value={quantities[data.MatchingName]?.[size] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          data.MatchingName,
                          size,
                          e.target.value
                        )
                      }
                      min="0"
                    />
                  </td>
                ))}
                <td>{calculateTotalQuantity(data.MatchingName)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No yarn usage data found.</div>
      )}

      <button onClick={addOrderDetailsHandler}>Add Quantity</button>

      {updatedYarnUsageData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Updated Yarn Details</h2>
          <table
            border="1"
            cellPadding="10"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <thead>
              <tr>
                <th>Matching Name</th>
                <th>Yarn ID</th>
                {nonNullSizes.map((size) => (
                  <th key={size}>{size}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {updatedYarnUsageData.map((data, dataIndex) => {
                const yarnKeys = Object.keys(data).filter((key) =>
                  key.startsWith("Yarn")
                );
                return yarnKeys.map((key, yarnIndex) => (
                  <tr key={`${dataIndex}-${yarnIndex}`}>
                    {yarnIndex === 0 && (
                      <td rowSpan={yarnKeys.length}>{data.MatchingName}</td>
                    )}
                    <td>{data[key].YarnId}</td>

                    {nonNullSizes.map((size) => {
                      const updatedWeight = data[key][size] || 0;

                      return (
                        <td key={`${size}-${yarnIndex}`}>
                          {updatedWeight && updatedWeight !== 0
                            ? updatedWeight.toFixed(2)
                            : 0}
                        </td>
                      );
                    })}

                    <td>
                      {nonNullSizes
                        .reduce((total, size) => {
                          const updatedWeight = data[key][size] || 0;
                          return total + updatedWeight;
                        }, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
          <button onClick={addYarnHandler}>Add Yarn Details</button>
        </div>
      )}
    </div>
  );
};

export default AddOrderDetails;
