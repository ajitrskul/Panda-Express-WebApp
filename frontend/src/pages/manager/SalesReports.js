//import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
// import { format } from 'date-fns';
import { useState } from 'react';
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager/salesreports.css';

export default function SalesReports() {
  const [datesSelected, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    dateError: false
  });

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
      <div className="container-fluid page">
      <SidebarManager />
      <div className="page-background-container">
      <div className="container page-background">
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
                <span className="sales-top-product"> Orange Chicken</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="report-card">
                Total Sales:
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> $420</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
              </h2>
            </div>
            <div className="col" style={{minWidth:"250px"}}>
              <h2 className="report-card">
                Total Orders
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> 5000</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
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
      </div>
    </>
  );
}