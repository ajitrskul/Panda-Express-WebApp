//import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import { format } from 'date-fns';
import { useState } from 'react';
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager/salesreports.css';

export default function SalesReports() {
  const [datesSelected, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  return (
    <>
      <SidebarManager></SidebarManager>
      <div className="salesreport-bg"></div>
      <h1 className="sales-title">Sales Report</h1>
      <hr class="report-divider-big sales-divider"></hr>
      <div className="salesreport-container">
        <div className="fluid-container">
          <div className="row">
            <div className="col text-center">
              <p className="report-card">
                <span style={{marginRight:"10px"}}>Start Date: </span>
                <DatePicker
                  selected={datesSelected.startDate}
                  onChange={(date) => setSelectedDate({startDate:date, endDate: datesSelected.endDate})}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                />
              </p>
            </div>

            <div className="col text-center">
              <p className="report-card">
                <span style={{marginRight:"10px"}}>End Date: </span>
                <DatePicker
                  selected={datesSelected.endDate}
                  onChange={(date) => setSelectedDate({startDate:datesSelected.startDate, endDate: date})}
                  dateFormat="MM/dd/yyyy hh:mm aa"
                  showTimeSelect
                />
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12">
              <h2 className="report-card">
                Showing Results for {format(datesSelected.startDate, "MMMM dd, yyyy hh:mm aa")} to {format(datesSelected.endDate, "MMMM dd, yyyy hh:mm aa")}
                <hr class="report-divider"></hr>
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col">
              <h2 className="report-card">
                Most Popular Item:
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> Orange Chicken</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
              </h2>
            </div>
            <div className="col">
              <h2 className="report-card">
                Total Sales:
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> $420</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
              </h2>
            </div>
            <div className="col">
              <h2 className="report-card">
                Total Orders
                <hr class="report-divider"></hr>
                <span className="sales-top-product"> 5000</span> 
                <i id="report-dropdown-icon"  className="bi bi-chevron-down"></i>
                <i id="report-dropup-icon"  className="bi bi-chevron-up"></i>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}