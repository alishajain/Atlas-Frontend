import React, { useState, useEffect } from "react";
import { employeeDetails } from "../API/EmployeeApi";

const formatDate = (date) => {
  const jsDate = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return jsDate.toLocaleDateString("en-US", options);
};

const EmployeeDetails = () => {
  // State hooks to manage employees, loading state, and error state
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await employeeDetails(); // Fetch employee details
        setEmployees(data.data); // Set the employees' data to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("Failed to fetch employee details"); // Handle error
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchEmployeeData(); // Call the function to fetch data
  }, []); // Empty dependency array means this effect runs once on mount

  // If loading, show loading indicator
  if (loading) return <div>Loading...</div>;

  // If there's an error, show the error message
  if (error) return <div>{error}</div>;

  // If data is successfully fetched, display the employee list
  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Email ID</th>
            <th>Contact No</th>
            <th>Alternate Contact No</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Designation</th>
            <th>Anniversary Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(
            (
              emp // Ensure sampleDetails is an array
            ) => (
              <tr key={emp.EmpId}>
                <td>{emp.EmpId}</td>
                <td>{emp.EmpName}</td>
                <td>{emp.Address}</td>
                <td>{emp.EmailId}</td>
                <td>{emp.ContactNo}</td>
                <td>{emp.AltContactNo}</td>
                <td>{formatDate(emp.DOB)}</td>
                <td>{emp.Age}</td>
                <td>{formatDate(emp.JoiningDate)}</td>
                <td>{emp.Designation}</td>
                <td>{formatDate(emp.Anniversary)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetails;
