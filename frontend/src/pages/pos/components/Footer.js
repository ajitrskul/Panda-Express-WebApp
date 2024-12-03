import React from "react";

function Footer({ navigate, onBack }) {
  return (
    <div className="footer">
      <span>Ethan (temp)</span>
      <button 
        className="back-btn" 
        onClick={onBack} /* Use onBack to reverse the workflow step */
      >
        Back
      </button>
    </div>
  );
}

export default Footer;