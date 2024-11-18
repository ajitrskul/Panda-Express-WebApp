import React, { useState, useEffect } from "react";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import api from '../../services/api'; 

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("/manager/inventory");
        setInventory(response.data);
        const amounts = {};
        response.data.forEach((item) => {
          amounts[item.name] = 1;
        });
        setRestockAmounts(amounts);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleRestock = async (itemName) => {
    try {
      const amount = restockAmounts[itemName];
      await api.post("/manager/inventory/restock", { itemName, amount });
      window.location.reload();
    } catch (error) {
      console.error(`Error restocking item "${itemName}":`, error);
    }
  };

  const handleInputChange = (e, itemName) => {
    const value = parseInt(e.target.value, 10) || 0;
    setRestockAmounts((prev) => ({
      ...prev,
      [itemName]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid inventory-page">
      <SidebarManager />
      <div className="inventory-background-container">
        <div className="container inventory-background">
          <h2 className="inventory-title text-center">Inventory Management</h2>
          <hr class="inventory-divider-big"></hr>
          <div className="row">
            {inventory.map((item) => (
              <div
                key={item.name}
                className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4`}
              >
                <div
                  className={`card h-100 w-100 d-flex align-content-center p-3 mb-2 ${
                    item.inventoryRemaining < 5 ? "bg-danger inventory-card" : "bg-white inventory-card"
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title text-center">{item.name}</h5>
                    <div className="card-text text-center">
                      Remaining: {item.inventoryRemaining}
                    </div>
                    <div className="inventory-restock">
                      <input
                        type="number"
                        min="1"
                        value={restockAmounts[item.name]}
                        onChange={(e) => handleInputChange(e, item.name)}
                        className="form-control restock-input"
                      />
                      <button
                        onClick={() => handleRestock(item.name)}
                        className="btn btn-primary restock-button"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
