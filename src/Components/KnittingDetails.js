import React, { useState, useEffect } from "react";
import axios from "axios";

const KnittingDetails = () => {

  const [knittingDetails, setKnittingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    axios
      .get(`${API_URL}/KnittingDetails`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          // Ensure the response is an array
          setKnittingDetails(response.data.data);
        } else {
          setError("Invalid data format received.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading Sample Details...</p>;
  }

  if (error) {
    return <p>Error fetching sample details: {error}</p>;
  }

  return (
    <div>
      <h1>Knitting Details</h1>
      <table>
        <thead>
          <tr>
            <th>RSN</th>
            <th>Size</th>
            <th>
              <tr>Front-Right</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Front-Left</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Front-Complete</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Back-Right</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Back-Left</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Back-Complete</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Sleeves-Right</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Sleeves-Left</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Sleeves-Both</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Tape</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Collar</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Kharcha1</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Kharcha2</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Kharcha3</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
            <th>
              <tr>Total</tr>
              <tr>
                <td>Weight</td>
                <td>Time</td>
              </tr>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(knittingDetails) &&
            knittingDetails.map((sample) => (
              <tr key={sample.RSN}>
                <td>{sample.RSN}</td>
                <td>{sample.Size}</td>
                <td>
                  <tr>
                    <td>{sample.FrontRight.Weight}</td>
                    <td>{sample.FrontRight.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.FrontLeft.Weight}</td>
                    <td>{sample.FrontLeft.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.FrontComplete.Weight}</td>
                    <td>{sample.FrontComplete.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.BackRight.Weight}</td>
                    <td>{sample.BackRight.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.BackLeft.Weight}</td>
                    <td>{sample.BackLeft.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.BackComplete.Weight}</td>
                    <td>{sample.BackComplete.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.SleeveRight.Weight}</td>
                    <td>{sample.SleeveRight.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.SleeveLeft.Weight}</td>
                    <td>{sample.SleeveLeft.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.BothSleeves.Weight}</td>
                    <td>{sample.BothSleeves.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Tape.Weight}</td>
                    <td>{sample.Tape.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Collar.Weight}</td>
                    <td>{sample.Collar.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Kharcha1.Weight}</td>
                    <td>{sample.Kharcha1.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Kharcha2.Weight}</td>
                    <td>{sample.Kharcha2.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Kharcha3.Weight}</td>
                    <td>{sample.Kharcha3.Time}</td>
                  </tr>
                </td>
                <td>
                  <tr>
                    <td>{sample.Total.Weight}</td>
                    <td>{sample.Total.Time}</td>
                  </tr>
                </td>
              </tr>
            ))}
          {!Array.isArray(knittingDetails) && <p>Not an Array</p>}
        </tbody>
      </table>
    </div>
  );
};

export default KnittingDetails;
