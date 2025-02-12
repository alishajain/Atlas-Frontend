import React, { useState, useEffect } from "react";
import { getYarnIds, addYarnStockDetails } from "../API/YarnApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddYarnStockDetails = () => {
  const [yarnIds, setYarnIds] = useState([]);
  const [selectedYarnId, setSelectedYarnId] = useState("");
  const [date, setDate] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [weight, setWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [billNo, setBillNo] = useState("");
  const [lottNo, setLottno] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user.userId);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Yarn IDs when the component mounts
    getYarnIds()
      .then((data) => {
        setYarnIds(data.data);
      })
      .catch((error) => {
        setMessage("Error fetching Yarn IDs");
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Prepare form data
    const formData = {
      BillDate: date,
      YarnId: selectedYarnId,
      SupplierName: supplierName,
      SupplierCity: supplierCity,
      Weight: weight,
      Amount: amount,
      BillNo: billNo,
      LotNo: lottNo,
      UserId: userId,
    };

    try {
      const response = await addYarnStockDetails(formData);
      if (response.success) {
        setMessage("Yarn stock details added successfully.");

        // Reset form fields after successful submission
        setSelectedYarnId("");
        setDate("");
        setSupplierName("");
        setSupplierCity("");
        setWeight("");
        setAmount("");
        setBillNo("");
        setLottno("");

      } else {
        setMessage("Error adding yarn stock details.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to navigate to home
  const handleBack = () => {
    navigate("/yarn");
  };

  return (
    <div>
      <h2>Add Yarn Stock Details</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Bill Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="yarnId">Yarn ID:</label>
          <select
            id="yarnId"
            value={selectedYarnId}
            onChange={(e) => setSelectedYarnId(e.target.value)}
            required
          >
            <option value="">Select Yarn ID</option>
            {yarnIds.map((yarn) => (
              <option key={yarn.YarnId} value={yarn.YarnId}>
                {yarn.YarnId}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lottNo">Lot Number:</label>
          <input
            type="text"
            id="lottNo"
            value={lottNo}
            onChange={(e) => setLottno(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="supplierName">Supplier Name:</label>
          <input
            type="text"
            id="supplierName"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="supplierCity">Supplier City:</label>
          <input
            type="text"
            id="supplierCity"
            value={supplierCity}
            onChange={(e) => setSupplierCity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="amount">Cost:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="billNo">Bill Number:</label>
          <input
            type="text"
            id="billNo"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <div>
        <button onClick={handleBack}>Back</button>
      </div>
    </div>
  );
};

export default AddYarnStockDetails;
