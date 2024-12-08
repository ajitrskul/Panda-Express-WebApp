const StatusBadge = ({ status, onClick, isLoading }) => {
  const displayStatus = isLoading
    ? "Loading..."
    : status === true || status === null
    ? "Completed"
    : status === false
    ? "In-Progress"
    : "Unknown";

  const badgeClassMap = {
    "Completed": "bg-success",
    "In-Progress": "bg-warning",
    "Loading...": "bg-secondary",
    "Unknown": "bg-secondary",
  };

  const badgeClass = badgeClassMap[displayStatus] || "bg-secondary";

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{ cursor: onClick && !isLoading ? "pointer" : "default" }}
      onClick={onClick && !isLoading ? onClick : undefined} // Prevent clicks while loading
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;