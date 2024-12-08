import React from "react";

const StatusBadge = ({ status, onClick }) => {
  const displayStatus =
    status === "Loading..." ? "Loading..." :
    status === true || status === null ? "Completed" :
    status === false ? "In-Progress" :
    "Unknown";

  const badgeClassMap = {
    "Completed": "bg-success",
    "In-Progress": "bg-warning",
    "Loading...": "bg-secondary",
    "Unknown": "bg-secondary"
  };

  const badgeClass = badgeClassMap[displayStatus] || "bg-secondary";

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick ? onClick : undefined} 
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;