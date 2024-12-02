import React, { useState, useEffect } from "react";
import api from "../../../services/api";

function MenuSection({ apiEndpoint, onAddToOrder, navigate }) {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get(apiEndpoint);
        setMenuItems(response.data || []); // Ensure it's an array
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items. Please try again later.");
      }
    };

    fetchMenuItems();
  }, [apiEndpoint]);

  const formatItemName = (name) => {
    let formattedName = name.replace(/Small|Medium|Side/g, "");
    if (formattedName === "appetizer") {
      return "Appetizers & More";
    }
    formattedName = formattedName.replace(/([A-Z])/g, " $1").trim();
    return formattedName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (error) {
    return <div className="menu-error">{error}</div>;
  }

  return (
    <div className="menu-section">
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`menu-item-btn ${item.category ? "category-btn" : ""}`}
            onClick={() =>
              item.category
                ? navigate(`/kiosk/${item.category.toLowerCase()}`)
                : onAddToOrder(item)
            }
          >
            {formatItemName(item.item_name)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MenuSection;