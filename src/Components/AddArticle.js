import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addArticle, updateArticleNo } from "../API/ArticleApi";
import { getSize } from "../API/SampleApi";
import { useSelector } from "react-redux";

const AddArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const RSN = location.state ? location.state.RSN : null;
  const userId = useSelector((state) => state.user.userId);

  // State for form data
  const [sizeData, setSizeData] = useState(null);
  const [articleNumber, setArticleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sizes, setSizes] = useState({
    Freesize: { selected: false, wtvariance: "" },
    XS: { selected: false, wtvariance: "" },
    S: { selected: false, wtvariance: "" },
    M: { selected: false, wtvariance: "" },
    L: { selected: false, wtvariance: "" },
    XL: { selected: false, wtvariance: "" },
    "2XL": { selected: false, wtvariance: "" },
    "3XL": { selected: false, wtvariance: "" },
    "4XL": { selected: false, wtvariance: "" },
    "5XL": { selected: false, wtvariance: "" },
  });

  // Fetch size data from getSize API
  useEffect(() => {
    const fetchSizeData = async () => {
      try {
        const response = await getSize(RSN);
        setSizeData(response.data);
      } catch (err) {
        console.error("Failed to fetch size data:", err);
        setError("Failed to fetch size data. Please try again.");
      }
    };

    if (RSN) {
      fetchSizeData();
    }
  }, [RSN]);

  // Handle size selection change
  const handleSizeChange = (e) => {
    const { name, checked } = e.target;
    setSizes((prevSizes) => ({
      ...prevSizes,
      [name]: { ...prevSizes[name], selected: checked },
    }));
  };

  // Handle weight variance change
  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const size = name.split("_")[0]; // Extract the size from the input name
    setSizes((prevSizes) => ({
      ...prevSizes,
      [size]: { ...prevSizes[size], wtvariance: value },
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
  
    // Prepare form data based on selected sizes and their weight variance
    const formData = {
      RSN: RSN,
      ArticleNo: articleNumber,
      UserId: userId,
      Freesize: sizes.Freesize.selected ? sizes.Freesize.wtvariance : (isSizeMatched("Freesize")? "0": null),
      XS: sizes.XS.selected ? sizes.XS.wtvariance : (isSizeMatched("XS")? "0": null),
      S: sizes.S.selected ? sizes.S.wtvariance : (isSizeMatched("S")? "0": null),
      M: sizes.M.selected ? sizes.M.wtvariance : (isSizeMatched("M")? "0": null),
      L: sizes.L.selected ? sizes.L.wtvariance : (isSizeMatched("L")? "0": null),
      XL: sizes.XL.selected ? sizes.XL.wtvariance : (isSizeMatched("XL")? "0": null),
      "2XL": sizes["2XL"].selected ? sizes["2XL"].wtvariance : (isSizeMatched("2XL")? "0": null),
      "3XL": sizes["3XL"].selected ? sizes["3XL"].wtvariance : (isSizeMatched("3XL")? "0": null),
      "4XL": sizes["4XL"].selected ? sizes["4XL"].wtvariance : (isSizeMatched("4XL")? "0": null),
      "5XL": sizes["5XL"].selected ? sizes["5XL"].wtvariance : (isSizeMatched("5XL")? "0": null),
    };
  
    // Log the form data
    console.log("Form data:", formData);
  
    try {
      // Add article first
      const addResponse = await addArticle(formData);
      if (addResponse.success) {
        alert("Article added successfully!"); // Success alert
  
        // Now, call the updateArticleNo API to update ArticleNo with RSN
        const updateResponse = await updateArticleNo(RSN, { ArticleNo: articleNumber });
        if (updateResponse.message === "ArticleNo updated successfully.") {
          alert("Article number updated successfully!"); // Success alert
          navigate("/home");
        } else {
          alert("Failed to update article number. Please try again.");
        }
      } else {
        alert("Failed to add article. Please try again.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };  

  // Compare sizeData with sizes and set weight variance to '0' for matching sizes
  const isSizeMatched = (size) => {
    return sizeData && sizeData[0].Size === size;
  };

  const handleHomeButton = () => {
    navigate('/welcome-sample');
  };
  
  return (
    <div>
      <h1>Add Article</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>RSN:</label>
          <input type="text" value={RSN} disabled />
        </div>

        {/* Article Number Field */}
        <div>
          <label>Article Number:</label>
          <input
            type="text"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value)}
            required
          />
        </div>

        {/* Display the Size Data if it's available */}
        {sizeData && (
          <div>
            <h2>Allocate weight variation percentage in comparison to: {sizeData[0].Size}</h2>
          </div>
        )}

        {/* Sizes Checkboxes with weight variance */}
        <div>
          <label>Sizes:</label>
          <div>
            {Object.keys(sizes).map((size) => (
              <div key={size}>
                <input
                  type="checkbox"
                  name={size}
                  checked={sizes[size].selected}
                  onChange={handleSizeChange}
                  disabled={isSizeMatched(size)}
                />
                <label>{size.toUpperCase()}</label>
                {sizes[size].selected && (
                  <input
                    type="text"
                    name={`${size}_wtvariance`}
                    value={isSizeMatched(size) ? 0 : sizes[size].wtvariance}
                    placeholder="Weight variance (%)"
                    onChange={handleWeightChange}
                    readOnly={isSizeMatched(size)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Loading indicator */}
        {loading && <div>Loading...</div>}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <button onClick={handleHomeButton}>Home</button>
    </div>
  );
};

export default AddArticle;
