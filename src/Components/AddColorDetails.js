import React, { useState, useEffect } from "react";
import { addColorDetail } from "../API/ColorDetailApi";
import { getColorId } from "../API/ColorApi";
import { getYarnIds } from "../API/YarnApi";
import { useSelector } from "react-redux";

const AddColorDetails = ({ matchingName, RSN, size, selectedStates }) => {
  const initialRowState = {
    ColorId: "",
    Size: size,
    BaseColor: { YarnId: "", Weight: "" },
    yarnCount: 0,
    colors: [],
  };

  const [formData, setFormData] = useState([]);
  const [colorIds, setColorIds] = useState({});
  const [yarnIds, setYarnIds] = useState({});
  const [message, setMessage] = useState({ type: "", content: "" });

  // Extract selected panels from selectedStates
  const selectedPanels = Object.entries(selectedStates)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

  // Set initial formData when selectedStates change
  useEffect(() => {
    setFormData(
      selectedPanels.map((panelName) => ({
        ...initialRowState,
        ColorId: panelName,
      }))
    );
  }, [selectedStates]);

  // Fetch ColorId for each selected panel
  const fetchColorId = async () => {
    try {
      const newColorIds = {};

      for (const Panel of selectedPanels) {
        const data = await getColorId(RSN, matchingName, Panel);
        newColorIds[Panel] = data.ColorId;
      }

      // Update formData with the fetched ColorIds
      setFormData((prevFormData) =>
        prevFormData.map((row) => ({
          ...row,
          ColorId: newColorIds[row.ColorId] || row.ColorId,
        }))
      );
      setColorIds(newColorIds);
    } catch (error) {
      console.error("Error fetching ColorId:", error);
      setMessage({ type: "error", content: "Error fetching ColorIds." });
    }
  };

  // Fetch YarnIds for dropdown selection
  const fetchYarnIds = async () => {
    try {
      const response = await getYarnIds();

      if (response && response.data && typeof response.data === "object") {
        setYarnIds(response.data);
      } else {
        console.error("Error: YarnIds response is not an object", response);
        setMessage({
          type: "error",
          content: "Invalid data format for YarnIds.",
        });
      }
    } catch (error) {
      console.error("Error fetching YarnIds:", error);
      setMessage({ type: "error", content: "Error fetching YarnIds." });
    }
  };

  // Handle the number of yarns input change
  const handleYarnCountChange = (e, rowIndex) => {
    const yarnCount = parseInt(e.target.value, 10);
    const updatedFormData = formData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          yarnCount: yarnCount, // Update the yarn count for this row
          colors: Array(yarnCount).fill({ YarnId: "", Weight: "" }), // Adjust the colors array size based on yarn count
        };
      }
      return row;
    });
    setFormData(updatedFormData);
  };

  // Helper function to calculate the total weight for a row
  const calculateTotalWeight = (row) => {
    const baseWeight = parseFloat(row.BaseColor.Weight) || 0;
    const yarnsWeight = row.colors.reduce((sum, color) => {
      return sum + (parseFloat(color.Weight) || 0);
    }, 0);

    return baseWeight + yarnsWeight; // Sum base color weight and yarns' weights
  };

  // Handle input changes (BaseColor, Color1, Color2, etc.)
  const handleInputChange = (e, rowIndex, field, colorIndex = null) => {
    const { name, value } = e.target;

    const updatedFormData = formData.map((row, index) => {
      if (index === rowIndex) {
        const updatedRow = { ...row };

        if (field === "colors" && colorIndex !== null) {
          updatedRow.colors = updatedRow.colors.map((color, idx) =>
            idx === colorIndex ? { ...color, [name]: value } : color
          );
        } else if (field === "BaseColor") {
          updatedRow.BaseColor = {
            ...updatedRow.BaseColor,
            [name]: value,
          };
        } else {
          updatedRow[name] = value;
        }

        // Recalculate total weight after input change
        updatedRow.totalWeight = calculateTotalWeight(updatedRow);

        return updatedRow;
      }
      return row;
    });

    setFormData(updatedFormData);
  };

  // Fetch userId from Redux store (outside of the handleSubmit function)
  const userId = useSelector((state) => state.user.userId);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const colorData = formData.map((row) => {
      const colors = row.colors.reduce((acc, color, index) => {
        acc[`Color${index + 1}`] = { YarnId: color.YarnId, Weight: color.Weight };
        return acc;
      }, {});

      return {
        ColorId: row.ColorId,
        Size: row.Size,
        BaseColor: row.BaseColor,
        UserId: userId,
        
        ...colors,
      };
    });

    try {
      const responses = await Promise.all(
        colorData.map((data) => addColorDetail(data))
      );
      setMessage({ type: "success", content: "Data submitted successfully!" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", content: "Error submitting the form." });
    }
  };

  useEffect(() => {
    fetchYarnIds();
  }, []);

  return (
    <div>
      <h3>{matchingName}</h3>
      <button onClick={fetchColorId}>Fetch ColorIds</button>
      {message.content && (
        <div
          style={{
            color: message.type === "error" ? "red" : "green",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <table border="1" style={{ width: "100%", tableLayout: "auto" }}>
          <thead>
            <tr>
              <th style={{ width: "4%" }}>Panel</th>
              <th style={{ width: "4%" }}>Total Weight</th>
              <th style={{ width: "4%" }}>Base Yarn</th>
              <th style={{ width: "4%" }}>Yarns Used</th>
              {[...Array(14)].map((_, index) => (
                <th key={index} style={{ width: "6%" }}>
                  Yarn {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.ColorId}</td>
                <td>
                  <input
                    type="number"
                    name="totalWeight"
                    value={row.totalWeight || ""}
                    readOnly
                    style={{ backgroundColor: "#f0f0f0" }}
                  />
                </td>
                <td>
                  <select
                    name="YarnId"
                    value={row.BaseColor.YarnId || ""}
                    onChange={(e) => handleInputChange(e, rowIndex, "BaseColor")}
                  >
                    <option value="">Select Yarn</option>
                    {Object.values(yarnIds).length === 0 ? (
                      <option value="">No Yarn available</option>
                    ) : (
                      Object.values(yarnIds).map((yarn) => (
                        <option key={yarn.YarnId} value={yarn.YarnId}>
                          {yarn.YarnId}
                        </option>
                      ))
                    )}
                  </select>
                  <input
                    type="number"
                    name="Weight"
                    value={row.BaseColor.Weight || ""}
                    placeholder="Base Color Weight"
                    onChange={(e) => handleInputChange(e, rowIndex, "BaseColor")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.yarnCount || 0}
                    onChange={(e) => handleYarnCountChange(e, rowIndex)}
                    min={0}
                    max={14}
                    placeholder="Number of Yarns"
                  />
                </td>
                {row.colors.map((color, colorIndex) => (
                  <td key={colorIndex}>
                    <select
                      name="YarnId"
                      value={color.YarnId || ""}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, "colors", colorIndex)
                      }
                    >
                      <option value="">Select Yarn</option>
                      {Object.values(yarnIds).length === 0 ? (
                        <option value="">No Yarn available</option>
                      ) : (
                        Object.values(yarnIds).map((yarn) => (
                          <option key={yarn.YarnId} value={yarn.YarnId}>
                            {yarn.YarnId}
                          </option>
                        ))
                      )}
                    </select>
                    <input
                      type="number"
                      name="Weight"
                      value={color.Weight || ""}
                      placeholder={`Color ${colorIndex + 1} Weight`}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, "colors", colorIndex)
                      }
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
  );
};

export default AddColorDetails;
