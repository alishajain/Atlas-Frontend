import React, { useEffect, useState } from "react";
import { sampleList } from "../API/SampleApi";
import { useNavigate } from "react-router-dom";
import RSNInput from "./RSNInput";
import "../Styles/MachineDetails.css";

const SampleList = () => {
  const navigate = useNavigate();

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSampleList = async () => {
      try {
        const response = await sampleList();

        const updatedSamples = response.data.map((sample) => {
          return {
            ...sample,
            imagePath: sample.ImageData
              ? sample.ImageData.replace(/\\/g, "/")
              : null,
          };
        });

        setSamples(updatedSamples);
      } catch (err) {
        setError("Failed to load sample list");
      } finally {
        setLoading(false);
      }
    };

    fetchSampleList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleBackButton = () => {
    navigate('/welcome-sample');
  };

  return (
    <div>
      <RSNInput />
      <h2>Sample List</h2>
      <button onClick={handleBackButton}>Back</button>
      {samples.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>RSN</th>
              <th>ArticleNo</th>
              <th>Total Sample Weight</th>
              <th>Total Knitting Time</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => (
              <tr key={sample.RSN}>
                <td>{sample.RSN}</td>
                <td>{sample.ArticleNo || "N/A"}</td>
                <td>{sample.Total?.Weight || "0"}</td>
                <td>{sample.Total?.Time || "0"}</td>
                <td>
                  {sample.imagePath ? (
                    <img
                      src={`http://147.93.28.229:5000/${sample.imagePath}`}
                      alt="Sample Image"
                      style={{ width: "80px", height: "auto" }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No samples found.</p>
      )}
    </div>
  );
};

export default SampleList;
