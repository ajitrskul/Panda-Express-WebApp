import React from 'react';
import '../../../styles/kiosk/confirmDialog.css';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes, remove item
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No, go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
