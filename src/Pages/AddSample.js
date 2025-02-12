import React from "react";
import { useNavigate } from "react-router-dom";

const AddNewSample = () => {
  const navigate = useNavigate();
  
  const handleYesClick = () => {
    navigate("/add-sample-details"); 
  };

  const handleNoClick = () => {
    navigate("/welcome-sample"); 
  };

  return (
    <div>
      <h2>Do you want to add a new sample?</h2>

      <div>
        <button onClick={handleYesClick}>Yes</button>
        <button onClick={handleNoClick}>No</button>
      </div>
    </div>
  );
};

export default AddNewSample;
