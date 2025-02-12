import React, { useState } from "react";
import { updateImage } from "../API/ImageApi";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateImage = () => {
  const userId = useSelector((state) => state.user.userId) || 'admin';
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const RSN = location.state.RSN;

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle form submission to update image
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateImage(imageFile, imageName, RSN, userId);
      setSuccess(response.message);
      setImageFile(null);
      setImageName("");
    } catch (err) {
      setError("Error uploading the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to the show-sample page with RSN as state
  const handleBackClick = () => {
    navigate(`/show-sample/${RSN}`, { state: { RSN: RSN } });
  };

  return (
    <div>
      <h2>Update Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image Name:</label>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="Enter image name"
          />
        </div>

        <div>
          <label>Select Image to Upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Update Image"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleBackClick}>Back</button>
      </div>
    </div>
  );
};

export default UpdateImage;
