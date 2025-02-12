import React, { useState, useEffect } from 'react';
import { updateEmployee } from '../API/EmployeeApi'; // Import your API function

// Helper function to format date as yyyy-MM-dd
const formatDateForInput = (date) => {
  const jsDate = new Date(date);
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(jsDate.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
  return `${year}-${month}-${day}`; // Returns date in "yyyy-MM-dd" format
};

const UpdateEmployee = ({ employee, onSave, onCancel }) => {
  // Set up state for updated employee
  const [updatedEmployee, setUpdatedEmployee] = useState({ ...employee });
  const [successMessage, setSuccessMessage] = useState("");

  // Whenever employee prop changes, update the state
  useEffect(() => {
    setUpdatedEmployee({
      ...employee,
      // Format dates correctly
      DOB: formatDateForInput(employee.DOB),
      JoiningDate: formatDateForInput(employee.JoiningDate),
      Anniversary: formatDateForInput(employee.Anniversary),
    });
  }, [employee]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => {
      const updatedData = { ...prev, [name]: value };
      return updatedData;
    });
  };

  // Handle save button click
  const handleSave = async () => {
    if (!updatedEmployee.EmpName || !updatedEmployee.EmailId || !updatedEmployee.ContactNo) {
      alert("Please fill in all required fields.");
      return;
    }

    setSuccessMessage("Updated record successfully")
    try {
      const result = await updateEmployee(updatedEmployee);
      if (result.success) {
        onSave(result.data);
        alert("Updated Record");
      }
    } catch (err) {
      console.log("Error updating employee: " + err.message);
    }
  };

  return (
    <div>
      <h1>Update Employee</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form>
        <div>
          <label>Employee ID</label>
          <input
            type="text"
            name="EmpId"
            value={updatedEmployee.EmpId}
            readOnly
          />
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="EmpName"
            value={updatedEmployee.EmpName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="Address"
            value={updatedEmployee.Address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email ID</label>
          <input
            type="email"
            name="EmailId"
            value={updatedEmployee.EmailId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Contact No</label>
          <input
            type="text"
            name="ContactNo"
            value={updatedEmployee.ContactNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Alternate Contact No</label>
          <input
            type="text"
            name="AltContactNo"
            value={updatedEmployee.AltContactNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="DOB"
            value={updatedEmployee.DOB}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age</label>
          <input
            type="number"
            name="Age"
            value={updatedEmployee.Age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Joining Date</label>
          <input
            type="date"
            name="JoiningDate"
            value={updatedEmployee.JoiningDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Designation</label>
          <input
            type="text"
            name="Designation"
            value={updatedEmployee.Designation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Anniversary Date</label>
          <input
            type="date"
            name="Anniversary"
            value={updatedEmployee.Anniversary}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
