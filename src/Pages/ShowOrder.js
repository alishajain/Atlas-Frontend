import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayOrder from "../Components/DisplayOrder";
import ShowOrderDetails from "../Components/ShowOrderDetails";
import ShowOrderYarn from "../Components/ShowOrderYarn";

const ShowOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNo = location.state?.orderNo || "";

  const handleBackButton = () => {
    navigate("/order");
  };
  return (
    <div style={{ margin: "20px" }}>
      <DisplayOrder orderNo={orderNo} />
      <ShowOrderDetails orderNo={orderNo} />
      <ShowOrderYarn orderNo={orderNo} />

      <button onClick={handleBackButton}>
        Back
      </button>
    </div>
  );
};
export default ShowOrder;
