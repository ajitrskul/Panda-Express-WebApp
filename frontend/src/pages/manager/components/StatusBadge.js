import React from "react";

const StatusBadge = ({ status, onClick }) => {
  const badgeClass = {
    "Completed": "bg-success",
    "In-Progress": "bg-warning",
  }[status] || "bg-secondary";

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ cursor: "pointer" }}
      onClick={onClick} 
    >
      {status}
    </span>
  );
};

export default StatusBadge;