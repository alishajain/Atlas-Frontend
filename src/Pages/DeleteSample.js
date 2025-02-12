import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteSample } from '../API/SampleApi';  // Assuming you have the API functions in this path

const DeleteSample = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [RSN, setRSN] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Get RSN from location state
    if (location.state && location.state.RSN) {
      setRSN(location.state.RSN);
    } else {
      setError('RSN is required');
    }
  }, [location]);

  const handleDelete = async () => {
    if (!RSN) {
      setError('RSN is required');
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Call the delete function from the API
      const response = await deleteSample(RSN);

      if (response.success) {
        setSuccessMessage('Sample record deleted successfully.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(response.message || 'Failed to delete the sample record.');
      }
    } catch (err) {
      setError(err.message || 'Error deleting the sample record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-sample-container">
      <h2>Delete Sample Record</h2>
      
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
      
      <div>
        <p>Are you sure you want to delete the sample record with RSN: <strong>{RSN}</strong>?</p>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          style={{ backgroundColor: 'red', color: 'white', padding: '10px', cursor: 'pointer' }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Sample'}
        </button>
      </div>
    </div>
  );
};

export default DeleteSample;
