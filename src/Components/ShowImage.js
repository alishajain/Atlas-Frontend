import React, { useState, useEffect } from "react";
import { getImageByRSN } from "../API/ImageApi";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const ShowImage = ({ RSN }) => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state on each fetch attempt
        const response = await getImageByRSN(Number(RSN));

        // Check if response data contains image and handle it
        if (
          response.data &&
          response.data.length > 0 &&
          response.data[0].ImageData
        ) {
          const imagePath = response.data[0].ImageData.replace(/\\/g, "/");
          setImageData(imagePath);
        } else {
          setImageData(null); // No image data found
          setError("No image uploaded yet."); // Set error if no image found
        }
      } catch (err) {
        setError("Error fetching image.");
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [RSN]);

  // Navigate to the Update Image page
  const handleUpdateImage = () => {
    navigate(`/update-image/${RSN}`, { state: { RSN: RSN } });
  };

  const handleAddImage = () => {
    navigate(`/add-image/${RSN}`, {
      state: { RSN: RSN },
    });
  };

  if (loading) {
    return <p>Loading image...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleAddImage}>Add Image</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleUpdateImage}>Update Image</button>
      </div>

      {imageData ? (
        <img
          src={`http://147.93.28.229:5000/${imageData}`}
          alt="Sample"
          style={{ width: "100%", maxWidth: "600px" }}
        />
      ) : (
        <p>No image found for this RSN.</p>
      )}
    </div>
  );
};

export default ShowImage;
