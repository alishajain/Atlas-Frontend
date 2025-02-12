import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserId } from '../Redux/userSlice'; // Action to set the userId in Redux state
import { loginUser } from '../API/UserApi'; // API call for logging in

const Login = () => {
  const [userId, setUserIdState] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to show progress
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!userId || !password) {
      setMessage("User ID and Password are required.");
      return;
    }

    setLoading(true); // Start loading state
    try {
      // Make the login API call
      const data = await loginUser({ UserID: userId, Password: password });

      if (data.success) {
        dispatch(setUserId(userId)); // Dispatching the action to store userId
        setMessage(data.message);
        navigate('/home'); // Navigate to home on success
      } else {
        setMessage(data.message); // Display error message
      }
    } catch (error) {
      setMessage("An error occurred during login.");
      console.error("Error during login:", error);
    } finally {
      setLoading(false); // Reset loading state after request is completed
    }
  };

  // Navigate to signup page
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h1>Welcome to ATLAS</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>UserId:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserIdState(e.target.value)}
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
          {loading ? "Logging in..." : "Login"} {/* Button shows progress text */}
        </button>
      </form>
      {message && <p>{message}</p>} {/* Display success or error message */}

      {/* Button to redirect to Signup page */}
      <button onClick={handleSignupRedirect} className="signup-button">
        Don't have an account? Sign Up
      </button>
    </div>
  );
};

export default Login;
