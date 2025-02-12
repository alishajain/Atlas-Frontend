import React, { useState } from 'react';
import { uploadImage } from '../API/ImageApi'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddImage = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const RSN =  location.state.RSN || {};
  const userId = useSelector((state) => state.user.userId);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !imageName) {
      alert("Please provide an image and a name");
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const result = await uploadImage(image, imageName, RSN, userId);

      if (result && result.message) {
        setUploadStatus(result.message); // Set the success message from the API response
      } else {
        setUploadStatus("Image uploaded, but no message returned.");
      }
    } catch (error) {
      console.error("Error during image upload:", error); // Debug log to see error details
      setUploadStatus(`Error uploading image: ${error.message}`);
    }
  };

  // Function to navigate to another path when the button is clicked
  const handleNext = () => {
    navigate(`/add-processes/${RSN}`, { state: {RSN}});
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imageName">Image Name</label>
          <input
            type="text"
            id="imageName"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Select Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Upload Image</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}

      {/* Add the Navigate button */}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default AddImage;
