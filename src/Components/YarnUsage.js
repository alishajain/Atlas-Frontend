import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getColorIds, getMatchingNameByRSN } from "../API/ColorApi";
import { getColorDetailByColorId } from "../API/ColorDetailApi";
import { addYarnUsage } from "../API/YarnUsageApi";
import { useSelector } from "react-redux";

const YarnUsage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const RSN = location.state?.RSN || null;
  const userId = useSelector((state) => state.user.userId);

  const [matchingNames, setMatchingNames] = useState([]);
  const [colorDetailsByMatchingName, setColorDetailsByMatchingName] = useState(
    {}
  );
  const [loading, setLoading] = useState(true);

  // Simplified Yarn Data Accumulation
  const accumulateYarnData = (colorDetails) => {
    const yarnIdWeightPairs = {};

    colorDetails.forEach((colorDetail) => {
      const addYarnPair = (yarnId, weight) => {
        yarnIdWeightPairs[yarnId] = (yarnIdWeightPairs[yarnId] || 0) + weight;
      };

      if (colorDetail.BaseColor?.YarnId) {
        addYarnPair(
          colorDetail.BaseColor.YarnId,
          parseFloat(colorDetail.BaseColor.Weight)
        );
      }

      for (let i = 1; i <= 14; i++) {
        const colorKey = `Color${i}`;
        if (colorDetail[colorKey]?.YarnId) {
          addYarnPair(
            colorDetail[colorKey].YarnId,
            parseFloat(colorDetail[colorKey].Weight)
          );
        }
      }
    });

    return Object.entries(yarnIdWeightPairs).map(([YarnId, Weight]) => ({
      YarnId,
      Weight,
    }));
  };

  // Fetching matching names and color details by RSN
  useEffect(() => {
    const fetchData = async () => {
      if (!RSN) {
        console.error("RSN is null or undefined. Cannot fetch data.");
        setLoading(false);
        return;
      }

      try {
        // Fetch matching names by RSN
        const matchingNamesResponse = await getMatchingNameByRSN(RSN);
        setMatchingNames(matchingNamesResponse.data);

        const colorDetailsDataByMatchingName = {};

        for (const matchingName of matchingNamesResponse.data) {
          const colorIdsResponse = await getColorIds(
            RSN,
            matchingName.MatchingName
          );

          if (colorIdsResponse?.data?.length > 0) {
            const colorDetailsPromises = colorIdsResponse.data.map(
              async (color) => {
                if (color?.ColorId) {
                  const colorDetailResponse = await getColorDetailByColorId(
                    color.ColorId
                  );
                  return colorDetailResponse[0];
                }
                return null;
              }
            );

            // Wait for all color details to be fetched
            const colorDetailsData = await Promise.all(colorDetailsPromises);
            colorDetailsDataByMatchingName[matchingName.MatchingName] =
              colorDetailsData.filter(Boolean);
          }
        }
        setColorDetailsByMatchingName(colorDetailsDataByMatchingName);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [RSN]);

  // Prepare yarn usage data
  const prepareYarnUsageData = () => {
    return matchingNames.map((matchingName) => {
      const colorDetails =
        colorDetailsByMatchingName[matchingName.MatchingName] || [];
      const yarnData = accumulateYarnData(colorDetails);

      const yarnUsage = {
        RSN,
        MatchingName: matchingName.MatchingName,
        UserId: userId,
      };

      yarnData.forEach((entry, index) => {
        yarnUsage[`Yarn${index + 1}`] = {
          YarnId: entry.YarnId,
          Weight: entry.Weight,
        };
      });

      // Ensure missing Yarn entries are set to null
      for (let i = yarnData.length; i < 15; i++) {
        yarnUsage[`Yarn${i + 1}`] = null;
      }

      return yarnUsage;
    });
  };

   // Handle Back button
   const handleBackButton = () => {
    navigate(`/show-color/${RSN}`, { state: { RSN } });
  };

  // Handle inserting data
  const handleInsertData = async () => {
    try {
      const yarnUsageData = prepareYarnUsageData();

      const processedMatchingNames = new Set();

      for (let i = 0; i < yarnUsageData.length; i++) {
        const yarnUsage = yarnUsageData[i];

        // Call the API for each yarn usage data item
        const response = await addYarnUsage(yarnUsage);

        // Add MatchingName to processed set to avoid reprocessing
        processedMatchingNames.add(yarnUsage.MatchingName);
      }

      // Notify user that the data insertion was successful
      alert("Yarn usage data inserted successfully.");
    } catch (error) {
      console.error("Error inserting yarn usage data:", error);
      alert("An error occurred while inserting yarn usage data.");
    }
  };

  // Handle Next button
  const handleNext = () => {
    navigate(`/sample-actions/${RSN}`, { state: { RSN } });
  };

  return (
    <div>
      <h1>Yarn Usage Details by Matching Name</h1>
      {loading ? (
        <p>Loading yarn usage data...</p>
      ) : Object.keys(colorDetailsByMatchingName).length > 0 ? (
        <div>
          {matchingNames.map((matchingName) => {
            const colorDetails =
              colorDetailsByMatchingName[matchingName.MatchingName] || [];

            return (
              <div key={matchingName.MatchingName}>
                <h3>{matchingName.MatchingName}</h3>
                {colorDetails.length > 0 ? (
                  <table border="1">
                    <thead>
                      <tr>
                        <th>YarnId</th>
                        <th>Total Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accumulateYarnData(colorDetails).map((pair, index) => (
                        <tr key={index}>
                          <td>{pair.YarnId}</td>
                          <td>{pair.Weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No color details available for this matching name.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No yarn usage data available.</p>
      )}

      <button onClick={handleBackButton}>Back</button>
      <button onClick={handleInsertData}>Insert Data</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default YarnUsage;
