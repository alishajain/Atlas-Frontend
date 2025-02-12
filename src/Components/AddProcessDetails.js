import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addProcess } from "../API/ProcessApi";
import { empId } from "../API/EmployeeApi";
import { getYarnIds } from "../API/YarnApi";

const AddProcessDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const RSN = location.state ? location.state.RSN : 74;
  const userId = useSelector((state) => state.user.userId);

  // Process names list
  const processNames = [
    "Button",
    "Cutting",
    "Embroidery",
    "Kaj",
    "Kachi-Checking",
    "Kachi-Press",
    "Kachi-Wash",
    "Kachian",
    "Lable",
    "Linking",
    "Mending",
    "Overlock",
    "Pakki Packing",
    "Pakki Press",
    "Pakki Wash",
    "Printing",
    "Raffu",
    "Side",
    "Sewing",
    "Tailoring",
    "Thoke/Tanke",
    "Washcare",
    "Other",
  ];  

  // State for storing employee IDs and yarn IDs
  const [employees, setEmployees] = useState([]);
  const [yarnIds, setYarnIds] = useState([]);
  const [formData, setFormData] = useState([
    {
      ProcessName: '',
      EmpID: '',
      YarnUsed: '',
      YarnCost: 0,
      Material2: '',
      Material2Cost: 0,
      ManpowerCost: 0,
      UserId: "admin",
      CustomProcessName: '',
    },
  ]);

  // Fetch employee IDs and yarn IDs on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await empId();
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchYarnIds = async () => {
      try {
        const response = await getYarnIds();
        setYarnIds(response.data);
      } catch (error) {
        console.error("Error fetching yarn IDs:", error);
      }
    };

    fetchEmployees();
    fetchYarnIds();
  }, []);

  // Handle form input change
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    
    // If the ProcessName is "Other", update the custom process name
    if (name === "ProcessName" && value !== "Other") {
      updatedFormData[index].CustomProcessName = "";
    }
    setFormData(updatedFormData);
  };

  // Handle save button click (for a single row)
  const handleSave = async (index) => {
    const row = formData[index];
    const processName = row.ProcessName === "Other" ? row.CustomProcessName : row.ProcessName;
    const dataToSubmit = {
      ...row,
      ProcessName: processName,
      RSN,
    };

    try {
      const response = await addProcess(dataToSubmit);
      alert(`${dataToSubmit.ProcessName} details added successfully`);
    } catch (error) {
      console.error("Error adding process:", error);
    }
  };

  // Handle add another process button
  const handleAddProcess = () => {
    setFormData([
      ...formData,
      {
        ProcessName: "",
        EmpID: "",
        YarnUsed: "",
        YarnCost: 0,
        Material2: "",
        Material2Cost: 0,
        ManpowerCost: 0,
        UserId: userId,
        CustomProcessName: "",
      },
    ]);
  };

  return (
    <div>
      <h2 className="process-heading">Add Process Details</h2>
      <button type="button" className="nav-button" onClick={() => navigate(`/panel-selection/${RSN}`, { state: { RSN, action: 'Add'} })}>
        Next
      </button>
      
      <form className="process-form">
        <table className="process-table">
          <thead>
            <tr>
              <th className="process-table-header">Process Name</th>
              <th className="process-table-header">Employee Id</th>
              <th className="process-table-header">Yarn Used</th>
              <th className="process-table-header">Yarn Cost</th>
              <th className="process-table-header">Material 2</th>
              <th className="process-table-header">Material 2 Cost</th>
              <th className="process-table-header">Manpower Cost</th>
              <th className="process-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, index) => (
              <tr key={index}>
                <td className="process-table-cell">
                  <select
                    name="ProcessName"
                    value={row.ProcessName}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                    className="process-input"
                  >
                    <option value="">Select Process</option>
                    {processNames.map((processName, i) => (
                      <option key={i} value={processName}>
                        {processName}
                      </option>
                    ))}
                  </select>
                  {row.ProcessName === "Other" && (
                    <input
                      type="text"
                      name="CustomProcessName"
                      value={row.CustomProcessName}
                      onChange={(e) => handleInputChange(index, e)}
                      className="process-input"
                      placeholder="Enter Custom Process Name"
                    />
                  )}
                </td>
                <td className="process-table-cell">
                  <select
                    name="EmpID"
                    value={row.EmpID}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.EmpId} value={emp.EmpId}>
                        {emp.EmpId}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="process-table-cell">
                  <select
                    name="YarnUsed"
                    value={row.YarnUsed}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  >
                    <option value="">Select Yarn</option>
                    {yarnIds.map((yarn) => (
                      <option key={yarn.YarnId} value={yarn.YarnId}>
                        {yarn.YarnId}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="process-table-cell">
                  <input
                    type="number"
                    name="YarnCost"
                    value={row.YarnCost}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  />
                </td>
                <td className="process-table-cell">
                  <input
                    type="text"
                    name="Material2"
                    value={row.Material2}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  />
                </td>
                <td className="process-table-cell">
                  <input
                    type="number"
                    name="Material2Cost"
                    value={row.Material2Cost}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  />
                </td>
                <td className="process-table-cell">
                  <input
                    type="number"
                    name="ManpowerCost"
                    value={row.ManpowerCost}
                    onChange={(e) => handleInputChange(index, e)}
                    className="process-input"
                  />
                </td>
                <td className="process-table-cell">
                  <button
                    type="button"
                    className="process-submit-button"
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <button
        type="button"
        className="add-process-button"
        onClick={handleAddProcess}
      >
        Add Another Process
      </button>
    </div>
  );
};

export default AddProcessDetails;
