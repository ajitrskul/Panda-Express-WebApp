import React, { useState, useEffect } from "react";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import api from '../../services/api'; 

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [restockAmounts, setRestockAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [restocking, setRestocking] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get("/manager/inventory");
        setInventory(response.data);
        const amounts = {};
        response.data.forEach((item) => {
          amounts[item.name] = item.inventoryRemaining;
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

  const handleInputChange = (e, itemName) => {
    const value = e.target.value;
    if (value === "") {
      setRestockAmounts((prev) => ({
        ...prev,
        [itemName]: value, 
      }));
      return;
    }
  
    const parsedValue = Math.max(parseInt(value, 10) || 0, 0); 
    const currentAmount = inventory.find((item) => item.name === itemName)?.inventoryRemaining || 0;
    const delta = parsedValue - currentAmount;
  
    setRestockAmounts((prev) => ({
      ...prev,
      [itemName]: parsedValue,
    }));
  
    handleUpdateInventory(itemName, delta);
  };

  const handleInputBlur = (itemName) => {
    if (restockAmounts[itemName] === "") {
      const currentAmount = inventory.find((item) => item.name === itemName)?.inventoryRemaining || 0;
      setRestockAmounts((prev) => ({
        ...prev,
        [itemName]: currentAmount,
      }));
    }
  };

  const handleUpdateInventory = async (itemName, delta) => {
    try {
      await api.put("/manager/inventory/update", { itemName, amount: delta });
      setInventory((prev) =>
        prev.map((item) =>
          item.name === itemName
            ? { ...item, inventoryRemaining: Math.max(item.inventoryRemaining + delta, 0) }
            : item
        )
      );
    } catch (error) {
      console.error(`Error updating item "${itemName}":`, error);
    }
  };

  const incrementAmount = (itemName) => {
    setRestockAmounts((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1,
    }));
    handleUpdateInventory(itemName, 1);
  };

  const decrementAmount = (itemName) => {
    setRestockAmounts((prev) => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) - 1, 0),
    }));
    handleUpdateInventory(itemName, -1);
  };

  const handleRestockAll = async () => {
    setRestocking(true); 
    try {
      for (const item of inventory) {
        const amount = restockAmounts[item.name];
        if (amount > 0) {
          await api.post("/manager/inventory/restock/low", { itemName: item.name, amount });
        }
      }

      const response = await api.get("/manager/inventory");
      setInventory(response.data);

      const updatedRestockAmounts = {};
      response.data.forEach((item) => {
        updatedRestockAmounts[item.name] = item.inventoryRemaining;
      });
      setRestockAmounts(updatedRestockAmounts);
    } catch (error) {
      console.error("Error restocking all items:", error);
    } finally {
      setRestocking(false); 
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      const response = await api.get("/manager/inventory");
      setInventory(response.data);
    } else {
      const filtered = inventory.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      setInventory(filtered);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid page">
      <SidebarManager />
      <div className="page-background-container">
        <div className="container page-background">
          <h2 className="page-title text-center">Inventory Management</h2>
          <hr className="page-divider-big" />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control w-50"
              placeholder="Search Inventory"
            />
            <button
              onClick={handleRestockAll}
              className="btn btn-success"
              disabled={restocking} 
            >
              {restocking ? "Restocking..." : "Restock All"}
            </button>
          </div>
          <div className="row">
            {inventory.map((item) => (
              <div
                key={item.name}
                className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4`}
              >
                <div
                  className={`card h-100 w-100 d-flex align-content-center px-2 py-1 ${
                    item.inventoryRemaining < 10 ? "border-danger inventory-card" : "border-white inventory-card"
                  }`}
                  style={{borderWidth: "10px"}}
                >
                  <div className="card-body">
                    <h5 className="card-title text-center" style={{ fontSize: '1.25rem' }}>{item.name}</h5>
                    <img src={item.image} className="card-img-top" alt={item.name} />
                    <div className="card-text text-center" style={{ fontSize: '0.8rem', marginBottom: '0px' }}>
                      Remaining:
                    </div>
                    <div className="inventory-buttons d-flex align-items-center m-0">
                      <button
                        onClick={() => decrementAmount(item.name)}
                        className="btn btn-primary remove-button"
                        disabled={item.inventoryRemaining <= 0}
                        style={{ fontSize: '1rem'}}
                      >
                        ↓
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={restockAmounts[item.name] === "" ? "" : restockAmounts[item.name] || 0}
                        onChange={(e) => handleInputChange(e, item.name)}
                        onBlur={() => handleInputBlur(item.name)}
                        className="form-control restock-input mx-2"
                        style={{ width: "60px" }}
                      />
                      <button
                        onClick={() => incrementAmount(item.name)}
                        className="btn btn-primary restock-button"
                        style={{ fontSize: '1rem'}}
                      >
                        ↑
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