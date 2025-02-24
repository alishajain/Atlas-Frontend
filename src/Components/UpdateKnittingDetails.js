import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateKnittingDetails, getMachineNos } from "../API/SampleApi";
import { useSelector } from "react-redux";

const UpdateKnittingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { RSN, selectedStates, action } = location.state || {};
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [machineNos, setMachineNos] = useState([]);

  const userId = useSelector((state) => state.user.userId);

  // Fetch machine numbers
  useEffect(() => {
    if (!RSN) {
      setError("RSN is missing.");
      return;
    }

    const fetchMachineNos = async () => {
      try {
        const response = await getMachineNos();
        setMachineNos(response.data);
      } catch (error) {
        setError("Failed to fetch machine numbers");
      }
    };

    fetchMachineNos();
  }, [RSN, selectedStates, action]);

  // Handle input changes for Weight, Time, and MachineNo
  const handleChange = (e, field, type) => {
    const { value } = e.target;

    // Validate if the value is negative for Weight and Time
    if (type === "Weight" || type === "Time") {
      if (parseFloat(value) < 0) {
        setError(`${type} cannot be negative.`);
        return;
      }
    }

    setFormData((prevData) => {
      const newFormData = { ...prevData };
      if (!newFormData[field]) newFormData[field] = {};
      newFormData[field][type] = value;

      // Recalculate total
      newFormData.Total = calculateTotal(newFormData);
      return newFormData;
    });

    // Clear any previous error
    setError(null);
  };

  const calculateTotal = (data) => {
    let totalWeight = 0;
    let totalTime = 0;

    // Calculate total weight and time for all relevant fields
    Object.keys(data).forEach((key) => {
      if (key !== "RSN" && key !== "Size" && key !== "Total") {
        const { Weight, Time } = data[key];
        totalWeight += parseFloat(Weight) || 0;
        totalTime += parseFloat(Time) || 0;
      }
    });

    return { Weight: totalWeight, Time: totalTime };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if both Weight and Time are provided for each field
    for (let field in formData) {
      if (typeof formData[field] === "object") {
        const { Weight, Time, MachineNo } = formData[field];
        if (Weight === "" || Time === "" || MachineNo === "") {
          setError(`Weight, Time, and MachineNo must be provided for ${field}`);
          return;
        }
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formDataUserId = { ...formData, userId };

    try {
      const response = await updateKnittingDetails(RSN, formDataUserId);
      setSuccess("Knitting details updated successfully!");
    } catch (error) {
      setError(error.message || "An error occurred while updating knitting details");
    } finally {
      setLoading(false);
    }

    navigate(`/add-color-details/${RSN}`, { state: { RSN, selectedStates, action, size: formData.Size } });
  };

  return (
    <div>
      <h1>{action === "Add" ? "Add Knitting Details" : "Update Knitting Details"}</h1>
      <form onSubmit={handleSubmit}>
        <table border="1">
          <thead>
            <tr>
              <th>Field</th>
              <th>Weight</th>
              <th>Time</th>
              <th>Machine No</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RSN:</td>
              <td colSpan="3">
                <input type="text" name="RSN" value={formData.RSN || RSN} disabled />
              </td>
            </tr>
            <tr>
              <td>Size:</td>
              <td colSpan="3">
                <input
                  type="text"
                  name="Size"
                  value={formData.Size || ""}
                  onChange={(e) => setFormData({ ...formData, Size: e.target.value })}
                  required
                />
              </td>
            </tr>
            {Object.keys(selectedStates).map((field) =>
              selectedStates[field] ? (
                <tr key={field}>
                  <td>{field}</td>
                  <td>
                    <input
                      type="number"
                      value={formData[field]?.Weight || ""}
                      onChange={(e) => handleChange(e, field, "Weight")}
                      placeholder="Weight"
                      min="0" // Prevent negative values
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={formData[field]?.Time || ""}
                      onChange={(e) => handleChange(e, field, "Time")}
                      placeholder="Time"
                      min="0" // Prevent negative values
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={formData[field]?.MachineNo || ""}
                      onChange={(e) => handleChange(e, field, "MachineNo")}
                      required
                    >
                      <option value="">Select Machine No</option>
                      {machineNos.map((machineNo) => (
                        <option key={machineNo} value={machineNo}>
                          {machineNo}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ) : null
            )}
            <tr>
              <td>Total</td>
              <td>{formData.Total?.Weight || 0}</td>
              <td>{formData.Total?.Time || 0}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default UpdateKnittingDetails;