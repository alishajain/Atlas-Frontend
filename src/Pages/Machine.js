import React from "react";
import { useNavigate } from "react-router-dom";

// Example Machine Component
const Machine = () => {
  const navigate = useNavigate();

  // Button handlers
  const handleShowAllMachines = () => {
    navigate("/show-machine");
  };

  const handleAddNewMachine = () => {
    navigate("/add-machine");
  };

  const handleSearchMachine = () => {
    navigate("/search-machine");
  };

  const handleHome = () => {
    navigate("/home");
  };

  return (
    <div>
      <h2>Machine Management</h2>
      <div>
        <button onClick={handleShowAllMachines}>Show All Machines</button>
        <button onClick={handleAddNewMachine}>Add New Machine</button>
        <button onClick={handleSearchMachine}>Search Machine</button>
      </div>
      <div>
        <button onClick={handleHome}>Home</button>
      </div>
    </div>
  );
};

export default Machine;
