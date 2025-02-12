import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RSNInput = () => {
  const [RSN, setRSN] = useState("");
  const navigate = useNavigate();

  const handleRSNSubmit = (e) => {
    e.preventDefault();
    if (RSN.trim() === "") {
      alert("Please enter a valid RSN");
      return;
    }
    navigate(`/show-sample/${RSN}`, { state: { RSN: RSN } });
  };

  return (
    <div>
      <h1>Enter RSN</h1>
      <form onSubmit={handleRSNSubmit}>
        <div>
          <label htmlFor="RSN">Enter RSN:</label>
          <input
            type="text"
            id="RSN"
            value={RSN}
            onChange={(e) => setRSN(e.target.value)}
            placeholder="Enter RSN to fetch details"
            required
          />
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RSNInput;
