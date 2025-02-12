import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useDispatch, useSelector } from 'react-redux'; // Import necessary hooks from Redux
import { addMachine } from '../API/MachineApi'; // Assuming you have the API function

const AddMachine = () => {
  const UserId = useSelector((state) => state.user.userId);

  const [machineData, setMachineData] = useState({
    MachineNo: '',
    ModelNo: '',
    MachineType: '',
    Category: '',
    CountPeriod: '',
    MachineSystem: '',
    MachineStatus: '',
    Remarks: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!UserId) {
      setError('User ID is required');
      return;
    }

    const machineDataWithUserId = { ...machineData, UserId: UserId }; // Add UserId to machineData

    try {
      const result = await addMachine(machineDataWithUserId); // Pass the updated data to the API
      if (result.success) {
        setSuccessMessage('Machine added successfully');
        setMachineData({
          MachineNo: '',
          ModelNo: '',
          MachineType: '',
          Category: '',
          CountPeriod: '',
          MachineSystem: '',
          MachineStatus: '',
          Remarks: '',
        });
      }
    } catch (err) {
      setError('Error adding machine');
    }
  };

  // Handle back button click
  const handleBackButton = () => {
    navigate('/machine');
  };

  return (
    <div>
      <h1>Add New Machine</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="MachineNo">Machine No:</label></td>
              <td>
                <input
                  type="text"
                  name="MachineNo"
                  placeholder="Machine No"
                  value={machineData.MachineNo}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="ModelNo">Model No:</label></td>
              <td>
                <input
                  type="text"
                  name="ModelNo"
                  placeholder="Model No"
                  value={machineData.ModelNo}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="MachineType">Machine Type:</label></td>
              <td>
                <input
                  type="text"
                  name="MachineType"
                  placeholder="Machine Type"
                  value={machineData.MachineType}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="Category">Category:</label></td>
              <td>
                <input
                  type="text"
                  name="Category"
                  placeholder="Category"
                  value={machineData.Category}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="CountPeriod">Count Period:</label></td>
              <td>
                <input
                  type="text"
                  name="CountPeriod"
                  placeholder="Count Period"
                  value={machineData.CountPeriod}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="MachineSystem">Machine System:</label></td>
              <td>
                <input
                  type="text"
                  name="MachineSystem"
                  placeholder="Machine System"
                  value={machineData.MachineSystem}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="MachineStatus">Machine Status:</label></td>
              <td>
                <input
                  type="text"
                  name="MachineStatus"
                  placeholder="Machine Status"
                  value={machineData.MachineStatus}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="Remarks">Remarks:</label></td>
              <td>
                <input
                  type="text"
                  name="Remarks"
                  placeholder="Remarks"
                  value={machineData.Remarks}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <button type="submit">Add Machine</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <button onClick={handleBackButton} style={{ marginBottom: '20px' }}>
        Back
      </button>
    </div>
  );
};

export default AddMachine;
