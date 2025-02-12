import React from "react";
import { useNavigate } from "react-router-dom";

const Yarn = () => {
  const navigate = useNavigate();

  // Function to handle button click and navigate
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h2>Yarn Component</h2>
      <button onClick={() => handleNavigation("/add-yarn")}>Add Yarn</button>
      <button onClick={() => handleNavigation("/add-yarn-stock")}>
        Add Yarn stock
      </button>
      <button onClick={() => handleNavigation("/show-yarn")}>
        Show Yarn details
      </button>
      <button onClick={() => handleNavigation("/yarn-stock")}>
        Show Input Yarn details
      </button>

      <div>
        <button onClick={() => handleNavigation("/home")}>Home</button>
      </div>
    </div>
  );
};

export default Yarn;
