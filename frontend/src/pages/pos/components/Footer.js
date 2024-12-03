import React from "react";

function Footer({ navigate, onBack, menuEndpoint }) {
  return (
    <div className="footer">
      <span>Ethan (temp)</span>
      {menuEndpoint !== "/pos/menu" && (
        <button 
          className="back-btn" 
          onClick={onBack}
        >
          Back
        </button>
      )}
    </div>
  );
}

export default Footer;