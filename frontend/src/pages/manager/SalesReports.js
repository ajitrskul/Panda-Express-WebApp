//import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import { useState, useEffect } from 'react';
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager/salesreports.css';
import api from '../../services/api'; 

export default function SalesReports() {
  const [datesSelected, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    dateError: false
  });

  const [dropDown, setDropDown] = useState({
    topItem: false,
    topSale: false,
    topOrder: false
  })

  const [salesReportData, setSalesReportData] = useState({
    product1: {
      name: "N/A",
      count: "null"
    },
    product2: {
      name: "N/A",
      count: "null"
    },
    product3: {
      name: "N/A",
      count: "null"
    },
    product4: {
      name: "N/A",
      count: "null"
    },
    product5: {
      name: "N/A",
      count: "null"
    },
    totalSales: "N/A",
    totalOrders: "N/A"
  });

  const fetchSalesReport = async () => {
    try {
      const response = await api.post('/manager/salesreports', {
        startDate: datesSelected.startDate.toISOString(), 
        endDate: datesSelected.endDate.toISOString()
      });

      setSalesReportData(response.data);
    } catch {
      console.log("error!");
    }
  }

  useEffect(() => {
    fetchSalesReport();
  }, [])

  const salesDropDown = (event) => {
    const id=event.target.id;
    switch(id){
      default:
        break;
      case "topItem":
        setDropDown({
          ...dropDown,
          topItem: !dropDown.topItem
        })
        break;
      case "topSale":
        setDropDown({
          ...dropDown,
          topSale: !dropDown.topSale
        })
        break;
      case "topOrder":
        setDropDown({
          ...dropDown,
          topOrder: !dropDown.topOrder
        })
        break;
    }
  }

  const checkStartDate = (date) => {
    if (date >= datesSelected.endDate) {
      setSelectedDate({
        ...datesSelected,
        dateError: true
      })
    }
    else {
      setSelectedDate({
        startDate: date,
        endDate: datesSelected.endDate,
        dateError: false
      })
    }
  }

  const checkEndDate = (date) => {
    if (date <= datesSelected.startDate) {
      setSelectedDate({
        ...datesSelected,
        dateError: true
      })
    }
    else {
      setSelectedDate({
        startDate: datesSelected.startDate,
        endDate: date,
        dateError: false
      })
    }
  }

  return (
    <>
      <div className="salesreport-bg">
        <SidebarManager></SidebarManager>
        <div className="fluid-container salesreport-container">
          <div className="row justify-content-start">
            <h1 className="col-12 sales-title">Sales Report</h1>
            <hr class="col-12 sales-divider"></hr>
          </div>
          <div className="row">
            <div className="col text-start" style={{minWidth:"800px"}}>
              <p className="sales-card">
                <span style={{marginRight:"5px", fontSize: "18px"}}>Start Date: </span>
                <DatePicker
                  id="start-date"
                  selected={datesSelected.startDate}
                  onChange={checkStartDate}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                  className="sales-datepicker"          
                />

                <span style={{marginRight:"5px",fontSize: "18px", marginLeft:"30px"}}>End Date: </span>
                <DatePicker
                  id="end-date"
                  selected={datesSelected.endDate}
                  onChange={checkEndDate}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                  className="sales-datepicker"
                />

                <button className="sales-button" onClick={fetchSalesReport}>Refresh Report</button>

                {datesSelected.dateError && <span style={{display:"block", color:"red", fontSize:"18px", marginTop:"10px"}}>Please input a valid date</span>}
              </p>
            </div>
          </div>
          <div className="row justify-content-center" style={{marginBottom:"20px"}}>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="sales-card">
                Best Selling Item(s):
                <hr class="report-divider"></hr>
                {!dropDown.topItem && <span className="sales-top-product justify-content-center">{salesReportData.product1.name}</span>}
                {dropDown.topItem && 
                <ol style={{fontWeight:"500", fontSize:"20px"}}>
                  <li>{salesReportData.product1.name}: <span style={{fontWeight:"100"}}>{salesReportData.product1.count} serving(s)</span></li>
                  <li>{salesReportData.product2.name}: <span style={{fontWeight:"100"}}>{salesReportData.product2.count} serving(s)</span></li>
                  <li>{salesReportData.product3.name}: <span style={{fontWeight:"100"}}>{salesReportData.product3.count} serving(s)</span></li>
                  <li>{salesReportData.product4.name}: <span style={{fontWeight:"100"}}>{salesReportData.product4.count} serving(s)</span></li>
                  <li>{salesReportData.product5.name}: <span style={{fontWeight:"100"}}>{salesReportData.product5.count} serving(s)</span></li>
                </ol>} 
                <div className="text-center sales-drop" styles={{width:"100%"}} id="topItem" onClick={salesDropDown}>
                  {!dropDown.topItem && <i  className="bi bi-chevron-down sales-drop-icon" id="topItem" onClick={salesDropDown}></i>}
                  {dropDown.topItem && <i class="bi bi-chevron-up" id="topItem" onClick={salesDropDown}></i>}
                </div>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="sales-card">
                Total Sales:
                <hr class="report-divider"></hr>
                <span className="sales-top-product">{salesReportData.totalSales}</span> 
                <div className="text-center sales-drop" styles={{width:"100%"}} id="topSale" onClick={salesDropDown}>
                  {!dropDown.topSale && <i className="bi bi-chevron-down" id="topSale" onClick={salesDropDown}></i>}
                  {dropDown.topSale && <i class="bi bi-chevron-up" id="topSale" onClick={salesDropDown}></i>}
                </div>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="sales-card">
                Total Orders
                <hr class="report-divider"></hr>
                <span className="sales-top-product">{salesReportData.totalOrders}</span> 
                <div className="text-center sales-drop" styles={{width:"100%"}} id="topOrder" onClick={salesDropDown}>
                  {!dropDown.topOrder && <i className="bi bi-chevron-down" id="topOrder" onClick={salesDropDown}></i>}
                  {dropDown.topOrder && <i class="bi bi-chevron-up" id="topOrder" onClick={salesDropDown}></i>}
                </div>
              </h2>
            </div>
          </div>
          <div className="row" style={{marginBottom:"20px"}}>
            <div className="col-6">
              <p className="report-card">Histogram of MenuItems & amount ordered</p>
            </div>
            <div className="col-6">
              <p className="report-card">Piechart of Menu Items for date query</p>
            </div>
          </div>
          <div className="classname row">
            <div className="col-12">
              <p className="report-card">Optional Table Dropdown</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}