import React from "react";

function Footer({ firstName, lastName, beastPoints, navigate, onBack, menuEndpoint }) {
  return (
    <div className="footer" style={footerStyles}>
      {beastPoints !== 0 && firstName !== "" && lastName !== "" && (
        <span>{firstName} {lastName} ({beastPoints} BPs)</span>
      )}
      {menuEndpoint !== "/pos/menu" && (
        <button 
          style={backButtonStyles} 
          onClick={onBack}
          className="back-btn"
        >
          ←
        </button>
      )}
    </div>
  );
}

const footerStyles = {
  position: 'relative', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const backButtonStyles = {
  alignItems: 'right',
  position: 'absolute', 
  top: '1%', 
  right: '0px', 
  color: "#fff", 
};

export default Footer;
