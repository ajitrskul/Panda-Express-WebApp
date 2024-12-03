import React, { useState, useEffect } from "react";
import api from "../../../services/api";

function MenuSection({ apiEndpoint, onAddToOrder, onSubitemSelect, formatNames }) {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get(apiEndpoint);
        setMenuItems(response.data || []);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items. Please try again later.");
      }
    };

    fetchMenuItems();
  }, [apiEndpoint]);

  if (error) {
    return <div className="menu-error">{error}</div>;
  }

  const getItemClass = (item) => {
    if (item.is_premium) return "premium-item";
    if (item.type === "side") return "side-item"; 
    if (item.type === "entree") return "entree-item"; 
    if (item.type === "dessert") return "dessert-item";
    if (item.type === "appetizer") return "appetizer-item";
    return ""; 
  };

  return (
    <div className="menu-section">
      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <button
              key={index}
              className={`menu-item-btn ${getItemClass(item)}`}
              onClick={() => (item.type ? onSubitemSelect(item) : onAddToOrder(item))}
            >
              {formatNames(item)}
            </button>
          ))
        ) : (
          <div className="menu-loading">Loading menu items...</div>
        )}
      </div>
    </div>
  );
}

export default MenuSection;