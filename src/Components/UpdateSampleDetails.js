import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateRecord } from "../API/SampleApi";
import { useSelector } from "react-redux";

const UpdateSampleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sampleDetails } = location.state || {};

  // Initialize form fields with the sampleDetails or set to empty if not available
  const [articleName, setArticleName] = useState(
    sampleDetails?.ArticleName || ""
  );
  const [designFileNo, setDesignFileNo] = useState(
    sampleDetails?.DesignFileNo || ""
  );
  const [seriesArticleFileNo, setSeriesArticleFileNo] = useState(
    sampleDetails?.SeriesArticleFileNo || ""
  );
  const [articleType, setArticleType] = useState(
    sampleDetails?.ArticleType || ""
  );
  const [gender, setGender] = useState(sampleDetails?.Gender || "");
  const [machineSpeed, setMachineSpeed] = useState(
    sampleDetails?.MachineSpeed || ""
  );
  const [designer, setDesigner] = useState(sampleDetails?.Designer || "");
  const [grapher, setGrapher] = useState(sampleDetails?.Grapher || "");
  const [master, setMaster] = useState(sampleDetails?.SampleMaster || "");
  const [sampleStatus, setSampleStatus] = useState(
    sampleDetails?.SampleStatus || ""
  );

  const [RSN] = useState(sampleDetails?.RSN || ""); // RSN should not be changed, so it's stored but not set via state

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user.userId);

  // Validate form data before submitting
  const validateForm = () => {
    if (!articleName || !designFileNo || !seriesArticleFileNo) {
      return "Article Name, Design File No, and Series Article File No are required.";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = {
      RSN,
      articleName,
      designFileNo,
      seriesArticleFileNo,
      articleType,
      gender,
      machineSpeed,
      designer,
      grapher,
      master,
      sampleStatus,
      userId,
    };

    setLoading(true);
    try {
      const result = await updateRecord(data);
      if (result.success) {
        setSuccessMessage(result.message);
        setError("");
      } else {
        setError(result.message || "Failed to update the record.");
        setSuccessMessage("");
      }
    } catch (err) {
      setError(err.message || "Error updating the record.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }

    navigate(`/show-sample/${RSN}`, { state: { RSN } });
  };

  return (
    <div>
      <h2>Update Record</h2>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>RSN:</label>
          <input type="number" value={RSN} readOnly /> {/* RSN is read-only */}
        </div>
        <div>
          <label>Article Name:</label>
          <input
            type="text"
            value={articleName}
            onChange={(e) => setArticleName(e.target.value)}
          />
        </div>
        <div>
          <label>Design File No:</label>
          <input
            type="text"
            value={designFileNo}
            onChange={(e) => setDesignFileNo(e.target.value)}
          />
        </div>
        <div>
          <label>Series Article File No:</label>
          <input
            type="text"
            value={seriesArticleFileNo}
            onChange={(e) => setSeriesArticleFileNo(e.target.value)}
          />
        </div>
        <div>
          <label>Article Type:</label>
          <input
            type="text"
            value={articleType}
            onChange={(e) => setArticleType(e.target.value)}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
        <div>
          <label>Machine Speed:</label>
          <input
            type="number"
            value={machineSpeed}
            onChange={(e) => setMachineSpeed(e.target.value)}
          />
        </div>
        <div>
          <label>Designer:</label>
          <input
            type="text"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          />
        </div>
        <div>
          <label>Grapher:</label>
          <input
            type="text"
            value={grapher}
            onChange={(e) => setGrapher(e.target.value)}
          />
        </div>
        <div>
          <label>Sample Master:</label>
          <input
            type="text"
            value={master}
            onChange={(e) => setMaster(e.target.value)}
          />
        </div>
        <div>
          <label>Sample Status:</label>
          <input
            type="text"
            value={sampleStatus}
            onChange={(e) => setSampleStatus(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update File Details"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSampleDetails;
