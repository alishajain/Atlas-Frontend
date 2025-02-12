import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../API/OrderApi';
import { getArticleNos } from '../API/ArticleApi';
import { useSelector } from 'react-redux';
import AddOrderDetails from './AddOrderDetails';  // Import AddOrderDetails component

const AddOrder = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  const [orderData, setOrderData] = useState({
    OrderDate: '',
    OrderStatus: '',
    Client: '',
    ArticleNo: '',
    DelieveryDate: '',
    ApprovedBy: '',
    UserId: userId,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [articleNos, setArticleNos] = useState([]);
  const [isOrderAdded, setIsOrderAdded] = useState(false);  // New state to track order addition

  useEffect(() => {
    const fetchArticleNos = async () => {
      try {
        const response = await getArticleNos();
        setArticleNos(response.data);
      } catch (err) {
        setError('Failed to fetch article numbers.');
        console.error(err);
      }
    };

    fetchArticleNos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await addOrder(orderData);
      setSuccess(response.message);
      setIsOrderAdded(true);
    } catch (error) {
      setError('Failed to add order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackButton = () => {
    navigate('/order');
  };

  // Reset the form to its initial state
  const handleAddAnotherOrder = () => {
    setOrderData({
      OrderDate: '',
      OrderStatus: '',
      Client: '',
      ArticleNo: '',
      DelieveryDate: '',
      ApprovedBy: '',
      UserId: userId,
    });
    setSuccess('');
    setError('');
    setIsOrderAdded(false);
  };

  return (
    <div>
      <h2>Add New Order</h2>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Date:</label>
          <input
            type="date"
            name="OrderDate"
            value={orderData.OrderDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Order Status:</label>
          <input
            type="text"
            name="OrderStatus"
            value={orderData.OrderStatus}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Client:</label>
          <input
            type="text"
            name="Client"
            value={orderData.Client}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Article No:</label>
          <select
            name="ArticleNo"
            value={orderData.ArticleNo}
            onChange={handleChange}
            required
          >
            <option value="">Select Article No</option>
            {articleNos.map((article) => (
              <option key={article.ArticleNo} value={article.ArticleNo}>
                {article.ArticleNo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Delivery Date:</label>
          <input
            type="date"
            name="DelieveryDate"
            value={orderData.DelieveryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Approved By:</label>
          <input
            type="text"
            name="ApprovedBy"
            value={orderData.ApprovedBy}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding Order...' : 'Add Order'}
          </button>
        </div>
      </form>
      <button onClick={handleBackButton}>Back</button>

      {/* Conditionally render AddOrderDetails component only if ArticleNo is available */}
      {isOrderAdded && orderData.ArticleNo && (
        <AddOrderDetails ArticleNo={orderData.ArticleNo} />
      )}

      {/* Add Another Order button */}
      {isOrderAdded && (
        <div>
          <button onClick={handleAddAnotherOrder}>Add Another Order</button>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
