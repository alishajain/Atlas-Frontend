import React, { useEffect, useState } from 'react';
import { getAllMachines } from '../API/MachineApi';
import { useNavigate } from 'react-router-dom';
import "../Styles/MachineDetails.css";

const MachineDetails = () => {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch all machines on component mount
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const result = await getAllMachines();
        setSuccess('Data fetched successfully.');
        setMachines(result.data);
      } catch (err) {
        setError('Error fetching machines');
      }
    };
    fetchMachines();
  }, []);
  
  // Handle back button click
  const handleBackButton = () => {
    navigate('/machine');
  };

  return (
    <div>
      <h1>All Machines</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <table>
        <thead>
          <tr>
            <th>MachineNo</th>
            <th>ModelNo</th>
            <th>MachineType</th>
            <th>Category</th>
            <th>Count Period</th>
            <th>Machine System</th>
            <th>MachineStatus</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {machines.length > 0 ? (
            machines.map((machine) => (
              <tr key={machine.MachineNo}>
                <td>{machine.MachineNo}</td>
                <td>{machine.ModelNo}</td>
                <td>{machine.MachineType}</td>
                <td>{machine.Category}</td>
                <td>{machine.CountPeriod}</td> {/* Changed <th> to <td> */}
                <td>{machine.MachineSystem}</td> {/* Changed <th> to <td> */}
                <td>{machine.MachineStatus}</td>
                <td>{machine.Remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No machines found</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handleBackButton} style={{ marginBottom: '20px' }}>
        Back
      </button>
    </div>
  );
};

export default MachineDetails;
