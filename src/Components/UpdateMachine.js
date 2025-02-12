import React, { useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector hook from Redux
import { updateMachineByMachineNo } from "../API/MachineApi";

const UpdateMachine = ({ machine, goBack }) => {
  // Fetch userId from Redux store
  const userId = useSelector((state) => state.user.userId);
  
  const [updatedMachine, setUpdatedMachine] = useState({ ...machine });
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMachine((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Adding userId to updatedMachine data
    const machineWithUserId = { ...updatedMachine, UserId: userId };

    try {
      const result = await updateMachineByMachineNo(machine.MachineNo, machineWithUserId);
      setSuccessMessage("Machine updated successfully");
    } catch (err) {
      setSuccessMessage("Machine details not updated");
    }
  };

  return (
    <div>
      <h2>Update Machine</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="ModelNo">Model No</label>
              </td>
              <td>
                <input
                  type="text"
                  name="ModelNo"
                  value={updatedMachine.ModelNo}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="MachineType">Machine Type</label>
              </td>
              <td>
                <input
                  type="text"
                  name="MachineType"
                  value={updatedMachine.MachineType}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Category">Category</label>
              </td>
              <td>
                <input
                  type="text"
                  name="Category"
                  value={updatedMachine.Category}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="CountPeriod">Count Period</label>
              </td>
              <td>
                <input
                  type="text"
                  name="CountPeriod"
                  value={updatedMachine.CountPeriod}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="MachineSystem">Machine System</label>
              </td>
              <td>
                <input
                  type="text"
                  name="MachineSystem"
                  value={updatedMachine.MachineSystem}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="MachineStatus">Machine Status</label>
              </td>
              <td>
                <input
                  type="text"
                  name="MachineStatus"
                  value={updatedMachine.MachineStatus}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Remarks">Remarks</label>
              </td>
              <td>
                <input
                  type="text"
                  name="Remarks"
                  value={updatedMachine.Remarks}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Update Machine</button>
      </form>

      <button onClick={goBack}>Go back to search</button>
    </div>
  );
};

export default UpdateMachine;
