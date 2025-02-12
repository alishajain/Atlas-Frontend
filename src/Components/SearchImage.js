// src/components/SearchImage.js
import React, { useState } from 'react';
import { getImageByRSN } from '../API/ImageApi';

const SearchImage = () => {
  const [RSN, setRSN] = useState('');
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');

  // Handle RSN input change
  const handleRSNChange = (e) => {
    setRSN(e.target.value);
  };

  // Handle form submit (search image by RSN)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setImageData(null);

    if (!RSN) {
      setError("Please enter a valid RSN.");
      return;
    }

    try {
      const result = await getImageByRSN(RSN);
      setImageData(result);
    } catch (err) {
      setError("Error fetching image. Please check the RSN.");
    }
  };

  return (
    <div>
      <h2>Search Image by RSN</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="RSN">RSN</label>
          <input
            type="text"
            id="RSN"
            value={RSN}
            onChange={handleRSNChange}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageData && (
        <div>
          <h3>Image Name: {imageData.ImageName}</h3>
          <img
            src={`data:image/jpeg;base64,${imageData.ImageData}`}
            alt={imageData.ImageName}
            style={{ width: '300px', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchImage;
