import React from "react";

const StatusBadge = ({ status, onClick }) => {
  const badgeClassMap = {
    "Completed": "bg-success",
    "In-Progress": "bg-warning",
  };

  const badgeClass = badgeClassMap[status] || "bg-secondary";

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? onClick : undefined} 
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
