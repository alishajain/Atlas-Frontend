import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addColorMatching, deleteColorMatching, getColorMatchingByRSN } from "../API/ColorApi";
import { useSelector } from "react-redux";
import AddColorDetails from "./AddColorDetails";

const AddColorMatching = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { RSN, selectedStates, action, size } = location.state || {};

  const [numColors, setNumColors] = useState(0);
  const [matchingName, setMatchingName] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showColorDetails, setShowColorDetails] = useState(false);

  // Fetch userId from Redux store
  const userId = useSelector((state) => state.user.userId);

  const handleNumColorsChange = (e) => {
    const num = e.target.value;

    if (num === "") {
      setError("");
    }

    if (num && num > 0) {
      setError("");
      setNumColors(num);
      setMatchingName(Array(num).fill(""));
    } else {
      setNumColors(num);
    }
  };

  // Handle the input change for each color match
  const handleColorMatchChange = (index, e) => {
    const newColorMatches = [...matchingName];
    newColorMatches[index] = e.target.value;
    setMatchingName(newColorMatches);
  };

  // Function to check if color matching data exists
  const checkColorMatchingExists = async (RSN) => {
    try {
      const response = await getColorMatchingByRSN(RSN);
      console.log('Color Matching Exists Response:', response);
      return response && response.length > 0;
    } catch (error) {
      console.error("Error checking for existing data:", error);
      return false;
    }
  };

  // Handle form submission for Color Matching
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      matchingName.length === 0 ||
      matchingName.some((name) => name.trim() === "")
    ) {
      setError("All color match fields must be filled.");
      return;
    }

    // Validate that the number of color matches is greater than 0
    if (numColors <= 0) {
      setError("Number of color matches must be greater than 0.");
      return;
    }

    const selectedPanels = Object.entries(selectedStates)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);

    if (selectedPanels.length === 0) {
      setError("No valid panels selected.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiCalls = [];

      if (action === "update") {
          const deleteResponse = await deleteColorMatching(RSN);
          apiCalls.push(deleteResponse); 
        
      }

      // Loop through each matchingName and create API calls for each selected panel
      matchingName.forEach((colorName) => {
        selectedPanels.forEach((panel) => {
          // Generate ColorId
          const colorData = {
            ColorId: `${panel
              .split("")
              .reduce(
                (acc, char) => (/[A-Z0-9]/.test(char) ? acc + char : acc),
                ""
              )}${RSN}${colorName[0].toUpperCase()}${colorName[1].toUpperCase()}${colorName[colorName.length - 1].toUpperCase()}${size}`,
            RSN: RSN,
            MatchingName: colorName,
            Panel: panel,
            userId: userId,
          };

          apiCalls.push(addColorMatching(colorData));
        });
      });

      const responses = await Promise.all(apiCalls);

      setSuccess("Color matching added successfully!");
      setShowColorDetails(true);
    } catch (error) {
      setError("An error occurred while adding color matching.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextClick = () => {
    if (action === "addUpdate") {
      navigate(`/show-color/${RSN}`, { state: { RSN } });
    } else if (action === "update") {
      navigate(`/show-sample/${RSN}`, { state: { RSN } });
    } else {
      navigate(`/add-sample`);
    }
  };

  return (
    <div>
      <h2>
        {action === "update" ? "Update Color Matching" : "Add Color Matching"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Number of color matches: </label>
          <input
            type="number"
            value={numColors}
            onChange={handleNumColorsChange}
            min="1"
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {Array.from({ length: numColors }).map((_, index) => (
          <div key={index}>
            <label>Color Matching {index + 1}:</label>
            <input
              type="text"
              value={matchingName[index] || ""}
              onChange={(e) => handleColorMatchChange(index, e)}
              required
            />
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : action === "update"
            ? "Update Color Matching"
            : "Add Color Matching"}
        </button>
      </form>

      {/* Display success message */}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Only show AddColorDetails numColors times if the button was clicked and data is valid */}
      {showColorDetails &&
        matchingName.map((colorName, index) => (
          <AddColorDetails
            key={index}
            matchingName={colorName}
            RSN={RSN}
            size={size}
            selectedStates={selectedStates}
          />
        ))}

      {success && (
        <button onClick={handleNextClick} style={{ marginTop: "20px" }}>
          Next
        </button>
      )}
    </div>
  );
};

export default AddColorMatching;
