import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchYarn from "./SearchYarn";

const YarnDetails = () => {
  const [yarnDetails, setYarnDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/YarnDetails`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setYarnDetails(response.data.data);
        } else {
          setError("Invalid data format received.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    navigate("/yarn"); // Navigate to the /yarn route
  };

  if (loading) {
    return <p>Loading Yarn Details...</p>;
  }

  if (error) {
    return <p>Error fetching Yarn details: {error}</p>;
  }

  return (
    <div>
      <h1>Yarn Details</h1>
      <table>
        <thead>
          <tr>
            <th>YarnID</th>
            <th>Yarn Type</th>
            <th>Yarn Count</th>
            <th>Color Name</th>
            <th>Color Code</th>
            <th>Weight (in Kgs)</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(yarnDetails) && yarnDetails.map((yarn) => (
            <tr key={yarn.YarnID}>
              <td>{yarn.YarnID}</td>
              <td>{yarn.YarnType}</td>
              <td>{yarn.YarnCount}</td>
              <td>{yarn.ColorName}</td>
              <td>{yarn.ColorCode}</td>
              <td>{yarn.Weight}</td>
            </tr>
          ))}
          {!Array.isArray(yarnDetails) && <p>Not an Array</p>}
        </tbody>
      </table>
      <SearchYarn />
      <div>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default YarnDetails;
