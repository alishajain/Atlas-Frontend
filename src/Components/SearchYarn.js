import React, { useState, useEffect } from "react";
import { getYarnIds, getYarnDetailsByLotNo } from "../API/YarnApi";

const SearchYarn = () => {
  const [selectedYarnId, setSelectedYarnId] = useState("");
  const [yarnIds, setYarnIds] = useState([]); // Initialize as empty array
  const [yarnDetails, setYarnDetails] = useState([]);

  // Fetch Yarn IDs on component mount
  useEffect(() => {
    const fetchYarnIds = async () => {
      try {
        const yarnIdsData = await getYarnIds();
        if (yarnIdsData && Array.isArray(yarnIdsData.data)) {
          setYarnIds(yarnIdsData.data);
        } else {
          console.error("Invalid data format for YarnIds", yarnIdsData);
        }
      } catch (error) {
        console.error("Error fetching Yarn IDs:", error);
      }
    };

    fetchYarnIds();
  }, []);

  // Fetch Yarn details when selected YarnId changes
  useEffect(() => {
    if (selectedYarnId) {
      const fetchYarnDetails = async () => {
        try {
          const yarnData = await getYarnDetailsByLotNo(selectedYarnId);
          setYarnDetails(yarnData.data || []);
        } catch (error) {
          console.error("Error fetching yarn details:", error);
        }
      };

      fetchYarnDetails();
    }
  }, [selectedYarnId]);

  return (
    <div>
      <h2>Yarn Details by LotNo</h2>
      <form>
        <div>
          <label htmlFor="yarnId">Yarn ID:</label>
          <select
            id="yarnId"
            value={selectedYarnId}
            onChange={(e) => setSelectedYarnId(e.target.value)}
            required
          >
            <option value="">Select Yarn ID</option>
            {Array.isArray(yarnIds) && yarnIds.length > 0 ? (
              yarnIds.map((yarn) => (
                <option key={yarn.YarnId} value={yarn.YarnId}>
                  {yarn.YarnId}
                </option>
              ))
            ) : (
              <option value="">No Yarn IDs available</option>
            )}
          </select>
        </div>
      </form>

      {yarnDetails.length > 0 && (
        <div>
          <h3>Yarn Details:</h3>
          <table>
            <thead>
              <tr>
                <th>Lot No</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {yarnDetails.map((yarn, index) => (
                <tr key={index}>
                  <td>{yarn.LotNo}</td>
                  <td>{yarn.TotalWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchYarn;
