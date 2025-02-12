import React, { useState } from "react";
import { addEmployee } from "../API/EmployeeApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const AddEmployeeDetails = () => {
  const navigate = useNavigate();

  // Access UserId from Redux store
  const UserId = useSelector((state) => state.user.userId);

  const [employeeData, setEmployeeData] = useState({
    EmpId: "",
    EmpName: "",
    Address: "",
    EmailId: "",
    ContactNo: "",
    AltContactNo: "",
    DOB: "",
    Age: "",
    JoiningDate: "",
    Designation: "",
    Anniversary: "",
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate the phone numbers (10 digits)
  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
  };

  // Validate email format using a regular expression
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message

    // Validate ContactNo and AltContactNo
    if (!validatePhoneNumber(employeeData.ContactNo)) {
      setLoading(false);
      setError("Contact number must be a 10-digit positive number.");
      return;
    }

    if (
      employeeData.AltContactNo &&
      !validatePhoneNumber(employeeData.AltContactNo)
    ) {
      setLoading(false);
      setError("Alternate contact number must be a 10-digit positive number.");
      return;
    }

    // Validate Email
    if (!validateEmail(employeeData.EmailId)) {
      setLoading(false);
      setError("Please provide a valid email address.");
      return;
    }

    try {
      // Add the UserId to the employee data before submitting
      const dataWithUserId = { ...employeeData, UserId };

      // Call the addEmployee function to submit data
      const response = await addEmployee(dataWithUserId);

      // Handle successful response
      setSuccessMessage("Employee added successfully!");
      setEmployeeData({}); // Reset form data
    } catch (err) {
      // Handle error response
      setError("Failed to add employee. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleHome = () => {
    navigate('/employee');
  };

  return (
    <div>
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="EmpId">Employee ID:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="EmpId"
                  name="EmpId"
                  value={employeeData.EmpId}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="EmpName">Employee Name:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="EmpName"
                  name="EmpName"
                  value={employeeData.EmpName}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Address">Address:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="Address"
                  name="Address"
                  value={employeeData.Address}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="EmailId">Email ID:</label>
              </td>
              <td>
                <input
                  type="email"
                  id="EmailId"
                  name="EmailId"
                  value={employeeData.EmailId}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="ContactNo">Contact No:</label>
              </td>
              <td>
                <input
                  type="number"
                  id="ContactNo"
                  name="ContactNo"
                  value={employeeData.ContactNo}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="AltContactNo">Alternate Contact No:</label>
              </td>
              <td>
                <input
                  type="number"
                  id="AltContactNo"
                  name="AltContactNo"
                  value={employeeData.AltContactNo}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="DOB">Date of Birth:</label>
              </td>
              <td>
                <input
                  type="date"
                  id="DOB"
                  name="DOB"
                  value={employeeData.DOB}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Age">Age:</label>
              </td>
              <td>
                <input
                  type="number"
                  id="Age"
                  name="Age"
                  value={employeeData.Age}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="JoiningDate">Joining Date:</label>
              </td>
              <td>
                <input
                  type="date"
                  id="JoiningDate"
                  name="JoiningDate"
                  value={employeeData.JoiningDate}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Designation">Designation:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="Designation"
                  name="Designation"
                  value={employeeData.Designation}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="Anniversary">Anniversary:</label>
              </td>
              <td>
                <input
                  type="date"
                  id="Anniversary"
                  name="Anniversary"
                  value={employeeData.Anniversary}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <div>
        <button onClick={handleHome}>Home</button>
      </div>
    </div>
  );
};

export default AddEmployeeDetails;
