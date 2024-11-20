import React, { useState } from "react";
import { SidebarManager } from "./components/SidebarManager";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import '../../styles/manager.css'
import api from "../../services/api";

function ProductUsage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await api.post("/manager/productUsage", { startDate, endDate });
      const data = response.data;
  
      const labels = data.map((item) => item.productName);
      const values = data.map((item) => item.servingsUsed);
  
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Servings Used",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
        console.error("Error restocking all items:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid page">
      <SidebarManager />
      <div className="page-background-container">
      <div className="container page-background">
        <h2 className="page-title text-center">Product Usage Report</h2>
        <hr class="page-divider-big"></hr>
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date and Time
              </label>
              <input
                type="datetime-local"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date and Time
              </label>
              <input
                type="datetime-local"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-success w-30">
                Generate Report
            </button>
            </div>
          </div>
        </form>
  
        {loading && <div>Loading...</div>}
  
        {chartData && (
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) =>
                        `${tooltipItem.label}: ${tooltipItem.raw} servings`,
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Products",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Servings Used",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
  }
  
  export default ProductUsage;
  