import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProcess, deleteProcess, addProcess } from "../API/ProcessApi";
import { getYarnIds } from "../API/YarnApi";
import { empId } from "../API/EmployeeApi";

const UpdateProcesses = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const RSN = location.state ? location.state.RSN : null;
  const userId = useSelector((state) => state.user.userId);

  // State for storing yarn IDs, employee data, and form data
  const [yarnIds, setYarnIds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(location.state.processes || []);
  const [loading, setLoading] = useState(false);

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
    setFormData(updatedFormData);
  };

  // Handle save button click (for a single row)
  const handleSave = async (index) => {
    const row = formData[index];
    try {
      setLoading(true);
      const response = await updateProcess(RSN, row.ProcessName, row);
      alert("Process updated successfully");
    } catch (error) {
      console.error("Error updating process:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete button click (for a single row)
  const handleDelete = async (index) => {
    const row = formData[index];

    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the process: ${row.ProcessName}?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await deleteProcess(RSN, row.ProcessName);

      // Remove the deleted row from the state
      const updatedFormData = formData.filter((_, i) => i !== index);
      setFormData(updatedFormData);

      alert("Process deleted successfully");
    } catch (error) {
      console.error("Error deleting process:", error);
      alert("Failed to delete process");
    } finally {
      setLoading(false);
    }
  };

  // Handle add button click (for a new row)
  const handleAdd = async (index) => {
    const row = formData[index];

    // Validate required fields
    if (!row.ProcessName || !row.EmpID) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      // Include RSN in the data sent to the API
      const payload = { ...row, RSN };
      const response = await addProcess(payload);

      // Mark the row as no longer new
      const updatedFormData = [...formData];
      updatedFormData[index].isNew = false;
      setFormData(updatedFormData);

      alert("Process added successfully");
    } catch (error) {
      console.error("Error adding process:", error);
      alert("Failed to add process");
    } finally {
      setLoading(false);
    }
  };

  // Handle add another process button
  const handleAddProcess = () => {
    setFormData([
      ...formData,
      {
        ProcessName: "",
        EmpID: "",
        Material1: "",
        Material1Cost: 0,
        Material2: "",
        Material2Cost: 0,
        ManpowerCost: 0,
        UserId: userId || "admin",
        CustomProcessName: "",
        isNew: true,
      },
    ]);
  };

  // Predefined process names (you can add more process options here)
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

  return (
    <div>
      <h2>Update Process Details</h2>

      <form className="process-form">
        <table className="process-table">
          <thead>
            <tr>
              <th>Process Name</th>
              <th>Employee ID</th>
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
                    value={row.ProcessName || ""}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                    disabled={!row.isNew} // Disable the select field if the row is not new
                  >
                    <option value="">Select Process</option>
                    {processNames.map((processName, i) => (
                      <option key={i} value={processName}>
                        {processName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="EmpID"
                    value={row.EmpID || ""}
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
                    name="Material1"
                    value={row.Material1 || ""}
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
                    name="Material1Cost"
                    value={row.Material1Cost || 0}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="Material2"
                    value={row.Material2 || ""}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="Material2Cost"
                    value={row.Material2Cost || 0}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="ManpowerCost"
                    value={row.ManpowerCost || 0}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td>
                  {row.isNew ? (
                    <button type="button" onClick={() => handleAdd(index)} disabled={loading}>
                      {loading ? "Adding..." : "Add"}
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleSave(index)} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button type="button" onClick={() => handleDelete(index)} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
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

export default UpdateProcesses;
