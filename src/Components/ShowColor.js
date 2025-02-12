import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getColorMatchingByRSN, getPanel } from "../API/ColorApi";
import { getColorDetailByColorId } from "../API/ColorDetailApi";
import { getSize } from "../API/SampleApi";

const isValidValue = (value) => {
  return value !== null && value !== "" && value !== 0;
};

const ShowColor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const RSN = location.state ? location.state.RSN : null;

  const [colorMatchingData, setColorMatchingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [colorDetails, setColorDetails] = useState({});
  const [selectedPanels, setSelectedPanels] = useState(null);
  const [selectedStates, setSelectedStates] = useState({});
  const [sizeData, setSizeData] = useState(null); // State to hold size data

  // First useEffect for fetching color matching data
  useEffect(() => {
    const fetchColorMatchingData = async () => {
      setLoading(true);
      try {
        const response = await getColorMatchingByRSN(RSN);
        setColorMatchingData(response.data);
      } catch (err) {
        setError("Failed to fetch color matching details.");
      } finally {
        setLoading(false);
      }
    };

    if (RSN) {
      fetchColorMatchingData();
    }
  }, [RSN]);

  // Fetch color detail by ColorId
  const fetchColorDetail = async (ColorId) => {
    if (!colorDetails[ColorId]) {
      try {
        const response = await getColorDetailByColorId(ColorId);
        setColorDetails((prevDetails) => ({
          ...prevDetails,
          [ColorId]: response,
        }));
      } catch (err) {
        console.error("Failed to fetch color detail for", ColorId);
      }
    }
  };

  // Fetch selected panels and update selectedStates when panels are fetched
  useEffect(() => {
    const fetchPanelData = async () => {
      try {
        const response = await getPanel(RSN);
        setSelectedPanels(response.data);

        // Format selectedPanels as selectedStates (object with values as keys and true as values)
        const states = response.data.reduce((acc, panel) => {
          const panelKey = panel.Panel;
          if (panelKey) {
            acc[panelKey] = true;
          }
          return acc;
        }, {});

        setSelectedStates(states);
      } catch (err) {
        console.error("Failed to fetch panel data:", err);
      }
    };

    if (RSN && !selectedPanels) {
      fetchPanelData();
    }
  }, [RSN, selectedPanels]);

  // Fetch size data from getSize API
  useEffect(() => {
    const fetchSizeData = async () => {
      try {
        const response = await getSize(RSN);
        setSizeData(response.data);
      } catch (err) {
        console.error("Failed to fetch size data:", err);
      }
    };

    if (RSN) {
      fetchSizeData();
    }
  }, [RSN]);

  if (loading) return <p>Loading color matching data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Group color matching data by MatchingName
  const groupedData = colorMatchingData?.reduce((acc, item) => {
    const { MatchingName } = item;
    if (!acc[MatchingName]) {
      acc[MatchingName] = [];
    }
    acc[MatchingName].push(item);
    return acc;
  }, {});

  // Function to render color details for each ColorId
  const renderColorDetail = (ColorId) => {
    const details = colorDetails[ColorId]?.[0];
    if (details) {
      const colorKeys = [
        "BaseColor",
        "Color1",
        "Color2",
        "Color3",
        "Color4",
        "Color5",
        "Color6",
        "Color7",
        "Color8",
        "Color9",
        "Color10",
        "Color11",
        "Color12",
        "Color13",
        "Color14",
      ];

      // Filter out invalid values
      const validColorKeys = colorKeys.filter((colorKey) => {
        const colorData = details[colorKey];
        return (
          colorData &&
          isValidValue(colorData.YarnId) &&
          isValidValue(colorData.Weight)
        );
      });

      const names = validColorKeys.map((colorKey) => details[colorKey].YarnId);
      const weights = validColorKeys.map(
        (colorKey) => details[colorKey].Weight
      );
      return (
        <td>
          {validColorKeys.length > 0 ? (
            <table border="1" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Property</th>
                  {validColorKeys.map((colorKey, index) => (
                    <th key={index}>{colorKey}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>YarnId</td>
                  {names.map((yarnId, index) => (
                    <td key={index}>{yarnId}</td>
                  ))}
                </tr>
                <tr>
                  <td>Weight</td>
                  {weights.map((weight, index) => (
                    <td key={index}>{weight}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No color details available for this ColorId.</p>
          )}
        </td>
      );
    }
    return <td>Loading...</td>;
  };

  // Function to handle navigation back
  const handleBack = () => {
    navigate(`/show-sample/${RSN}`, { state: { RSN } });
  };

  // Function to handle navigation next
  const handleNext = () => {
    navigate(`/yarn-usage/${RSN}`, { state: { RSN }, size: sizeData });
  };

  // Function to handle Add Color button click
  const handleAddColor = async () => {
    if (!selectedPanels) {
      console.log("Panels are not loaded yet, please try again later.");
      return;
    }
    navigate(`/add-color-details/${RSN}`, {
      state: { RSN, selectedStates, size: sizeData, action: "addUpdate" },
    });
  };

  return (
    <div>
      <h1>Color Matching Details for RSN: {RSN}</h1>
      {groupedData ? (
        Object.keys(groupedData).map((matchingName, index) => (
          <div key={index}>
            <h2>Matching name: {matchingName}</h2>
            <table border="1" style={{ width: "100%", marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>ColorId</th>
                  <th>Panel</th>
                  <th>Color Details</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[matchingName].map((item, itemIndex) => {
                  fetchColorDetail(item.ColorId);
                  return (
                    <tr key={itemIndex}>
                      <td>{item.ColorId}</td>
                      <td>{item.Panel}</td>
                      {renderColorDetail(item.ColorId)}{" "}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No color matching details available for this RSN.</p>
      )}
      <div>
        <button onClick={handleAddColor}>Add Color Matching</button>
      </div>
      <div>
        <button onClick={handleBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default ShowColor;
