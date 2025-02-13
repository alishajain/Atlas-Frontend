import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addProcess } from "../API/ProcessApi";
import { empId } from "../API/EmployeeApi";
import { getYarnIds } from "../API/YarnApi";

const AddProcessDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const RSN = location.state ? location.state.RSN : null;
  const userId = useSelector((state) => state.user.userId);
  const action = location.state ? location.state.action : null;

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
      ProcessName: "",
      EmpID: "",
      YarnUsed: "",
      YarnCost: 0,
      Material2: "",
      Material2Cost: 0,
      ManpowerCost: 0,
      UserId: "admin",
      CustomProcessName: "",
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
    const processName =
      row.ProcessName === "Other" ? row.CustomProcessName : row.ProcessName;
    const dataToSubmit = {
      ...row,
      ProcessName: processName,
      RSN,
    };

    try {
      await addProcess(dataToSubmit);
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

  // Handle Next button navigation based on action
  const handleNext = () => {
    if (action === "addUpdate") {
      navigate(`/show-sample/${RSN}`, { state: { RSN } });
    } else {
      navigate(`/panel-selection/${RSN}`, { state: { RSN, action: "Add" } });
    }
  };

  return (
    <div>
      <h2 className="process-heading">Add Process Details</h2>
      <button type="button" className="nav-button" onClick={handleNext}>
        Next
      </button>

      <form className="process-form">
        <table className="process-table">
          <thead>
            <tr>
              <th>Process Name</th>
              <th>Employee Id</th>
              <th>Yarn Used</th>
              <th>Yarn Cost</th>
              <th>Material 2</th>
              <th>Material 2 Cost</th>
              <th>Manpower Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    name="ProcessName"
                    value={row.ProcessName}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  >
                    <option value="">Select Process</option>
                    {processNames.map((process, i) => (
                      <option key={i} value={process}>
                        {process}
                      </option>
                    ))}
                  </select>
                  {row.ProcessName === "Other" && (
                    <input
                      type="text"
                      name="CustomProcessName"
                      value={row.CustomProcessName}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Enter Custom Process Name"
                    />
                  )}
                </td>
                <td>
                  <select
                    name="EmpID"
                    value={row.EmpID}
                    onChange={(e) => handleInputChange(index, e)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.EmpId} value={emp.EmpId}>
                        {emp.EmpId}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="YarnUsed"
                    value={row.YarnUsed}
                    onChange={(e) => handleInputChange(index, e)}
                  >
                    <option value="">Select Yarn</option>
                    {yarnIds.map((yarn) => (
                      <option key={yarn.YarnId} value={yarn.YarnId}>
                        {yarn.YarnId}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    name="YarnCost"
                    value={row.YarnCost}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="Material2"
                    value={row.Material2}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="Material2Cost"
                    value={row.Material2Cost}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="ManpowerCost"
                    value={row.ManpowerCost}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => handleSave(index)}>
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <button type="button" onClick={handleAddProcess}>
        Add Another Process
      </button>
    </div>
  );
};

export default AddProcessDetails;
