import React from "react";

function Footer({ navigate }) {
  return (
    <div className="footer">
      <span>Ethan (temp)</span>
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default Footer;