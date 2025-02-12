import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/userSlice";

// Import images from the 'src/images' folder
import sample from "../Images/sample.jpg";
import employee from "../Images/employee.jpg";
import machine from "../Images/machine.jpeg";
import yarn from "../Images/Yarn.jpg";
import order from "../Images/order.jpeg"

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>

      <h1>Welcome to the Home Page</h1>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <img
            src={yarn}
            alt="yarn"
            style={{ width: 130, height: 130, cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/yarn")}
          />
          <p>Yarn</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <img
            src={machine}
            alt="machine"
            style={{ width: 130, height: 130, cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/machine")}
          />
          <p>Machine</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <img
            src={employee}
            alt="employee"
            style={{ width: 130, height: 130, cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/employee")}
          />
          <p>Employee</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <img
            src={sample}
            alt="Sample"
            style={{ width: 130, height: 130, cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/welcome-sample")}
          />
          <p>Sample</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <img
            src={order}
            alt="Order"
            style={{ width: 130, height: 130, cursor: "pointer", marginBottom: "8px" }}
            onClick={() => navigate("/order")}
          />
          <p>Order</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
