import React from 'react';
import { useNavigate } from 'react-router-dom';

const Employee = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/add-employee');
  };

  const handleSearchClick = () => {
    navigate('/search-employee');
  };

  const handleShowAAllClick = () => {
    navigate('/show-employee');
  };

  const handleHome = () => {
    navigate('/home');
  };
  
  return (
    <div>
        <h1>Employee Actions</h1>
      <button onClick={handleAddClick}>Add</button>
      <button onClick={handleSearchClick}>Search</button>
      <button onClick={handleShowAAllClick}>Show All</button>
      <div>
        <button onClick={handleHome}>Home</button>
      </div>
    </div>
  );
};

export default Employee;
