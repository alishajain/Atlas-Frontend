import React from "react";
import { deleteEmployee } from "../API/EmployeeApi";

const DeleteEmployee = ({ empId, onDeleteSuccess, onDeleteError }) => {
  const handleDelete = async () => {
    try {
      const result = await deleteEmployee(empId);
      if (result.success) {
        onDeleteSuccess(empId);
      }
    } catch (err) {
      onDeleteError("Error deleting employee");
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteEmployee;
