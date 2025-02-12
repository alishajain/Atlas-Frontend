import React, { useState } from 'react';
import { registerUser, checkIfEmpIDExists } from '../API/UserApi';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userID, setUserID] = useState('');
  const [empID, setEmpID] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!userID || !empID || !password || !roles) {
      setMessage('All fields are required!');
      return;
    }

    try {
      setLoading(true);

      // Check if the EmpID already exists
      const empIDExists = await checkIfEmpIDExists(empID);
      if (empIDExists) {
        setMessage('An account with this EmpID already exists.');
        return;
      }

      // Register the user if EmpID is unique
      const userData = { UserID: userID, EmpID: empID, Password: password, roles: roles };
      const data = await registerUser(userData);

      if (data.success) {
        setMessage('Signup successful!');
        navigate('/');
      } else {
        setMessage(data.message || 'Signup failed!');
      }
    } catch (error) {
      setMessage('An error occurred during signup!');
      console.error('Error during signup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Welcome to ATLAS</h1>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>UserID:</label>
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Employee ID:</label>
          <input
            type="text"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Roles:</label>
          <input
            type="text"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
