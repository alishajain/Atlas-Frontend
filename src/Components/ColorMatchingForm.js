import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { addColorMatching } from "../API/ColorApi";

const ColorMatchingForm = ({ onSubmit }) => {
  const location = useLocation();
  const { RSN, selectedStates, size } = location.state || {};

  const [numColors, setNumColors] = useState(0); // Number of color matches
  const [buttonNames, setButtonNames] = useState([]); // Names for the buttons
  const [activeColorMatchIndices, setActiveColorMatchIndices] = useState([]); // To track which color matches are being edited
  const [formData, setFormData] = useState([]); // To store form data for the color match form
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if submit has been clicked
  const [successMessage, setSuccessMessage] = useState(""); // Track success message for submission
  const [errorMessage, setErrorMessage] = useState(""); // Track error message in case of failure

  // Function to generate ColorId
  const generateColorId = () => {
    const firstAndLastLetters = buttonNames
      .map((name) => {
        if (name) {
          return name[0].toUpperCase() + name[name.length - 1].toUpperCase();
        }
        return "";
      })
      .join(""); // Join first and last letters of each button name

    const selectedUppercase = Object.entries(selectedStates)
      .filter(([key, value]) => value === true) // Filter only fields where value is true
      .map(([key, value]) => key) // Get the keys (fields) that are true
      .filter((key) => /^[A-Z0-9]+$/.test(key)) // Keep only uppercase letters or numerals
      .join(""); // Join them into a single string

    return `${RSN}${firstAndLastLetters}${selectedUppercase}`;
  };

  // Handle number of colors change
  const handleNumColorsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumColors(num);
    setButtonNames(Array(num).fill("")); // Reset button names when the number changes
    setActiveColorMatchIndices([]); // Reset active color match when number of colors changes
    setIsSubmitted(false); // Reset submission state
    setSuccessMessage(""); // Reset success message
    setErrorMessage(""); // Reset error message
  };

  // Handle button name change
  const handleButtonNameChange = (index, e) => {
    const newNames = [...buttonNames];
    newNames[index] = e.target.value;
    setButtonNames(newNames);
  };

  // Handle form data change
  const handleFormDataChange = (rowIndex, colIndex, e) => {
    const newData = [...formData];
    if (!newData[rowIndex]) newData[rowIndex] = Array(16).fill(""); // Ensure each row has 16 columns
    newData[rowIndex][colIndex] = e.target.value;
    setFormData(newData);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate ColorId
    const colorId = generateColorId();

    // Iterate over each selected state and make a separate API call for each true state
    try {
      const promises = Object.entries(selectedStates)
        .filter(([panel, value]) => value === true) // Filter selected states that are true
        .map(([panel, value]) => {
          // Prepare the color data for each selected state
          const colorData = {
            RSN,
            colorId,
            panel, // Include the panel key in the data
            colorMatches: buttonNames,
            formData: formData,
          };

          // Call the addColorMatching API function for each selected state
          return addColorMatching(colorData);
        });

      // Wait for all API calls to complete
      await Promise.all(promises);

      // Handle success
      setSuccessMessage("Color matching data successfully added!");
      setErrorMessage(""); // Clear any error messages
      console.log("All color matching data added successfully");

      // Pass the button names and formData to the parent component (AddKnittingDetailsForm)
      onSubmit(buttonNames, formData);
    } catch (error) {
      // Handle error
      setErrorMessage("Failed to add color matching data. Please try again.");
      setSuccessMessage(""); // Clear success message in case of error
      console.error("API calls failed:", error);
    }

    setIsSubmitted(true); // Mark the form as submitted
  };

  // Open the color match form when a button is clicked
  const openColorMatchForm = (index) => {
    // Toggle the form visibility (show if not already visible, hide if already visible)
    setActiveColorMatchIndices(
      (prevIndices) =>
        prevIndices.includes(index)
          ? prevIndices.filter((i) => i !== index) // Remove the form if already active
          : [...prevIndices, index] // Add the form if not active
    );

    // Initialize the form data with rows based on selectedFields and columns = 16
    const initialFormData = Array(Object.keys(selectedStates).length).fill(
      Array(16).fill("")
    );
    setFormData(initialFormData);
  };

  useEffect(() => {
    if (selectedStates) {
      if (typeof selectedStates !== "object" || selectedStates === null) {
        console.error("selectedStates is not a valid object:", selectedStates);
        return;
      }
    }
  }, [selectedStates, RSN]);

  return (
    <div>
      <h2>Color Matching</h2>
      <p>RSN: {RSN}</p>
      <p>Size: {size}</p>
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
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
      <div>
        {Array.from({ length: numColors }, (_, index) => (
          <div key={index}>
            <label>Color Match {index + 1} Name: </label>
            <input
              type="text"
              value={buttonNames[index]}
              onChange={(e) => handleButtonNameChange(index, e)}
              required
            />
            {isSubmitted && (
              <button type="button" onClick={() => openColorMatchForm(index)}>
                Open Color Match Form
              </button>
            )}
          </div>
        ))}
      </div>
      {activeColorMatchIndices.map((index) => (
        <div key={index}>
          <h3>Color Match {index + 1} Form</h3>
          <form onSubmit={handleSubmit}>
            <table border="1">
              <thead>
                <tr>
                  <th>Field</th>
                  {Array.from({ length: 16 }, (_, index) => (
                    <th key={index}>Col {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedStates)
                  .filter(([key, value]) => value === true)
                  .map(([fieldKey, fieldValue], rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{fieldKey}</td>{" "}
                      {Array.from({ length: 16 }, (_, colIndex) => (
                        <td key={colIndex}>
                          <input
                            type="text"
                            value={
                              formData[rowIndex]
                                ? formData[rowIndex][colIndex]
                                : ""
                            }
                            onChange={(e) =>
                              handleFormDataChange(rowIndex, colIndex, e)
                            }
                            required
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
            <button type="submit">Submit</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default ColorMatchingForm;
