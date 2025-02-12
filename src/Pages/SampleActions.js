import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 

const SampleActions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const RSN = location.state ? location.state.RSN : null;

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    switch (option) {
      case "allocate":
        navigate(`/add-article/${RSN}`, { state: { RSN }});
        break;

      case "delete":
        navigate(`/delete-sample/${RSN}`, { state: { RSN }});
        break;

        case "home":
        navigate(`/home`);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <h1>Please select an action</h1>
      <div>
        <button onClick={() => handleOptionSelect("allocate")}>Allocate Article Number</button>
        <button onClick={() => handleOptionSelect("delete")}>Delete Sample Details</button>
        <button onClick={() => handleOptionSelect("home")}>Go back to Home</button>
      </div>

      {selectedOption && (
        <div>
          <h2>You selected: {selectedOption}</h2>
        </div>
      )}
    </div>
  );
};

export default SampleActions;
