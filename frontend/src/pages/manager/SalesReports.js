//import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
// import { format } from 'date-fns';
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

  const [salesReportData, setSalesReportData] = useState();

  const fetchSalesReport = async () => {
    const response = await api.get('/manager/salesreports');
    setSalesReportData(response.data);
  }

  useEffect(() => {
    fetchSalesReport();
  })

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
            <div className="col text-center" style={{minWidth:"400px"}}>
              <p className="sales-card">
                <span style={{marginRight:"10px"}}>Start Date: </span>
                <DatePicker
                  id="start-date"
                  selected={datesSelected.startDate}
                  onChange={checkStartDate}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                  className="sales-datepicker"
                />
                {datesSelected.dateError && <span style={{display:"block", color:"red", fontSize:"18px", marginLeft:"30px"}}>Please input a valid date</span>}
              </p>
            </div>

            <div className="col text-center" style={{minWidth:"400px"}}>
              <p className="sales-card">
                <span style={{marginRight:"10px"}}>End Date: </span>
                <DatePicker
                  id="end-date"
                  selected={datesSelected.endDate}
                  onChange={checkEndDate}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                  className="sales-datepicker"
                />
                {datesSelected.dateError && <span style={{display:"block", color:"red", fontSize:"18px", marginLeft:"30px"}}>Please input a valid date</span>}
              </p>
            </div>
          </div>
          <div className="row justify-content-center" style={{marginBottom:"20px"}}>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="report-card">
                Best Selling Item:
                <hr class="report-divider"></hr>
                <span className="sales-top-product justify-content-center"> Orange Chicken</span> 
                <div className="text-center sales-drop" styles={{width:"100%"}} id="topItem" onClick={salesDropDown}>
                  {!dropDown.topItem && <i  className="bi bi-chevron-down sales-drop-icon" id="topItem" onClick={salesDropDown}></i>}
                  {dropDown.topItem && <i class="bi bi-chevron-up" id="topItem" onClick={salesDropDown}></i>}
                </div>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="report-card">
                Total Sales:
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> $420</span> 
                <div className="text-center sales-drop" styles={{width:"100%"}} id="topSale" onClick={salesDropDown}>
                  {!dropDown.topSale && <i className="bi bi-chevron-down" id="topSale" onClick={salesDropDown}></i>}
                  {dropDown.topSale && <i class="bi bi-chevron-up" id="topSale" onClick={salesDropDown}></i>}
                </div>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="report-card">
                Total Orders
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> 5000</span> 
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