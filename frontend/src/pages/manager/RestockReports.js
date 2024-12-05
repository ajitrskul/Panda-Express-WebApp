
import React, { useState, useEffect } from "react";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import '../../styles/manager/restock.css';
import api from '../../services/api'; 

function RestockReports() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowInventory = async () => {
      try {
        const response = await api.get("/manager/inventory/low");
        setInventory(response.data);
        const amounts = {};
        response.data.forEach((item) => {
          amounts[item.name] = 1;
        });
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLowInventory();
  }, []);

  const handleRestockAll = async () => {
    try {
      await api.post("/manager/inventory/restock/low", {});
      window.location.reload();
    } catch (error) {
      console.error("Error restocking all items:", error);
    }
  };

  const handleRestock = async (item) => {
    try {
      const amount = 10 - item.inventoryRemaining;
      await api.put("/manager/inventory/update", {
        itemName: item.name,
        amount: amount,
      });
  
      window.location.reload();
    } catch (error) {
      console.error(`Error restocking item "${item.name}":`, error);
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
          <h2 className="page-title">Restock Report</h2>
          <hr class="page-divider-big"></hr>
          <div className="text-center mb-4">
            <button
              onClick={handleRestockAll}
              className="btn btn-danger"
            >
              Restock All
            </button>
          </div>
          <div className="row">
            {inventory.map((item) => (
              <div
                key={item.name}
                className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4`}
              >
                <div
                  className="card h-100 w-100 d-flex align-content-center p-3 mb-2 bg-white inventory-card custom-inv-card"
                >
                  <div className="card-body cbody">
                    <h5 className="card-title ctitle text-center">{item.name}</h5>
                    <img className="reimg" src={item.image} alt={item.name} />
                    <div className="card-text text-center remaining">
                      Remaining: {item.inventoryRemaining}
                    </div>
                    <div className="inventory-restock">
                      <button
                        onClick={() => handleRestock(item)}
                        className="btn btn-success restock-button rebutton"
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

export default RestockReports;
