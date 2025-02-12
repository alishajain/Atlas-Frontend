import React, { useState, useEffect } from 'react';
import { getCommentsByRSN, addComment } from '../API/CommentApi';
import { useSelector } from "react-redux";
import "../Styles/Comments.css";

const Comments = ({ RSN }) => {
  // State hooks for comments and new comment input
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  
  // Get userId from the Redux store
  const userId = useSelector((state) => state.user.userId);

  // Fetch comments on component mount or when RSN changes
  const fetchComments = async () => {
    try {
      const result = await getCommentsByRSN(RSN);
      setComments(result.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [RSN]);

  // Handle submitting a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const result = await addComment(RSN, userId, newComment);
      setNewComment('');
      setIsCommentBoxVisible(false);
      alert(result.message || 'Comment added successfully');

      fetchComments();
    } catch (error) {
      alert(error.message || 'Failed to add comment');
    }
  };

  // Handle showing and hiding the comment textbox
  const handleAddCommentClick = () => {
    setIsCommentBoxVisible(true);
  };

  return (
    <div>
      <h2>Comments for RSN: {RSN}</h2>
      
      <div>
        <h3>Comment Section</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan="3">No comments available</td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <tr key={index}>
                  <td>{comment.UserId}</td>
                  <td>{comment.Comments}</td>
                  <td>{new Date(comment.Date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div>
        {!isCommentBoxVisible ? (
          <button onClick={handleAddCommentClick}>Add Comment</button>
        ) : (
          <div>
            <h3>Add a Comment</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment here"
                required
                className='textarea'
              />
              <div>
                <button type="submit">Submit Comment</button>
                <button type="button" onClick={() => setIsCommentBoxVisible(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
