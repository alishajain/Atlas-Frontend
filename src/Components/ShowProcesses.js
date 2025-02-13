import React, { useState, useEffect } from "react";
import { searchByRSN } from "../API/ProcessApi";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ShowProcesses = ({ RSN }) => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await searchByRSN(RSN);
        if (response.length === 0) {
          setError("No processes found");
        }
        setProcesses(response);
      } catch (err) {
        setError("Error fetching processes");
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [RSN]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Navigate to update page
  const handleUpdateClick = () => {
    navigate(`/update-process/${RSN}`, {
      state: { processes, action: "update" },
    });
  };

  // Navigate to add page
  const handleAddClick = () => {
    navigate(`/add-processes/${RSN}`, {
      state: { RSN, action: "addUpdate" },
    });
  };

  return (
    <div>
      <h2>Process Details</h2>

      {error || processes.length === 0 ? (
        <div>
          <p>{error}</p>
          <button onClick={handleAddClick}>Add Processes</button>
        </div>
      ) : (
        <>
          <table className="process-table">
            <thead>
              <tr>
                <th>Process Name</th>
                <th>Yarn used</th>
                <th>Yarn Cost</th>
                <th>Material 2</th>
                <th>Material 2 Cost</th>
                <th>Manpower Cost</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td>{process.ProcessName}</td>
                  <td>{process.Material1}</td>
                  <td>{process.Material1Cost}</td>
                  <td>{process.Material2}</td>
                  <td>{process.Material2Cost}</td>
                  <td>{process.ManpowerCost}</td>
                  <td>{process.UserId}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button onClick={handleUpdateClick}>Update Process Details</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowProcesses;
