
import React, { useState, useEffect } from "react";
import api from '../../services/api'; 

import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import {LineChart,Line,XAxis,YAxis, PieChart, Pie,  Cell, Legend } from 'recharts';

function XReports() {
  /*const data1=[
    {name: "l", sales:250,orders:100},
    {name: "2", sales:180,orders:200},
    {name: "3", sales:300,orders:250},
    {name: "4", sales:200,orders:50},
    {name: "5", sales:50,orders:75},
  ];*/
  const data2=[
    {name: "Product l", value:400},
    {name: "Product 2", value:300},
    {name: "Product 3", value:150},
    {name: "Product 4", value:100},
    {name: "Product 5", value:50},
  ];
  const colors=["#77070a","#a3080c","rgb(98, 98, 98)","gray","rgb(163, 163, 163)"];
  const [XReportsData, setXReportsData] = useState(null);
  const fetchXReport = async () => {
    const response = await api.get('/manager/xreports'); 
    setXReportsData(response.data);
    
    
  };

  useEffect(() => {
    const reportDropupIcon=document.getElementById("report-dropup-icon");
    reportDropupIcon.style.display="none";
    
    fetchXReport();
    
    
  }, []); 



  const reportDropdownFunction = () =>{
    const ordersTable=document.getElementById("orders-by-hour");
    const reportDropdownIcon=document.getElementById("report-dropdown-icon");
    const reportDropupIcon=document.getElementById("report-dropup-icon");
    if(reportDropupIcon.style.display==="none"){
      ordersTable.style.display="block";
      reportDropupIcon.style.display="block";
      reportDropdownIcon.style.display="none";
    }
    else{
      ordersTable.style.display="none";
      reportDropupIcon.style.display="none";
      reportDropdownIcon.style.display="block";
    }
  };

  
  return (
    
      
      <div class="reports-background-container"> 
      <SidebarManager></SidebarManager>
      <div class="reports-background"> 
      <div class="title-container">
      <div class="reports-title">
        X Report
      </div>
      
      {XReportsData ? (
        <div class="reports-date"> {XReportsData.date} </div>// Display the "message" from the API response
      ) : (
        <div class="reports-date"></div>
      )}
     
      </div>
      <hr class="report-divider-big"></hr>
      <div class="report-container">
      <div class="report-card">
          Hour
          <i class="bi bi-clock-history report-card-icon"></i>
          <hr class="report-divider"></hr>
          {XReportsData ? (
            <div> {XReportsData.hour} </div>
          ) : (
            <div></div>
          )}
          
        </div>
        <div class="report-card">
          Total Sales
          <i class="bi bi-cash-coin report-card-icon"></i>
          <hr class="report-divider"></hr>
          {XReportsData ? (
            <div> {XReportsData.sales} </div>
          ) : (
            <div></div>
          )}
        </div>
        <div class="report-card">
          Total Orders
          <i class="bi bi-receipt-cutoff report-card-icon"></i>
          <hr class="report-divider"></hr>
          {XReportsData ? (
            <div> {XReportsData.orderNum} </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      
      <div class="report-container">
        <div class="report-card-big">
        Sales
        <hr class="report-divider"></hr>
        <div class="barchart-container">
        
        {XReportsData ? (
        <LineChart width={550} height={250} data={XReportsData.chartArr}>

          <XAxis dataKey="hour" tick={{dy:10}}/>
          <YAxis tick={{dx:-10}}></YAxis>
          <Line dataKey="sales" stroke="#a3080c" strokeWidth={2}></Line>
          {/*<Legend layout="vertical" align="left" verticalAlign="middle"/>*/}
        </LineChart>
        
          ) : (
            <div></div>
          )}
       
        </div>
        </div>
        <div class="report-card-big">
        Top Products Today
        <hr class="report-divider"></hr>
        <div class="piechart-container">
        <PieChart width={350} height={250}>
          <Pie
          data={data2}
          outerRadius={100}
          fill="#a3080c"
          >
            {data2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend layout="vertical" align="right" verticalAlign="middle"/>
        </PieChart>
        {/*{XReportsData ? (
            <div> {XReportsData.products} </div>
          ) : (
            <div></div>
          )}*/}
        </div>
        </div>
       
        </div>
        <div class="report-container">
        <div class="report-card-drop" onClick={reportDropdownFunction}>
          Orders by Hour
        <hr class="report-divider"></hr>

       <div id="orders-by-hour">
        {XReportsData ? (
            <div> 
            <div class="table-title-container">
                <div class="table-title">Hour </div>
                <div class="table-title">Orders </div>
                <div class="table-title">Sales </div>
            </div>
             {XReportsData.ordersByHour.map((item, elemRow ) => (
          <div class="orders-by-hour-row"
            key={elemRow}
          >
          {item.map((elem, elemInd) => (
          <div class="orders-by-hour-elem"
            key={elemInd}
          >
          {elem}
          </div>
        ))}
          </div>
        ))}
            </div>
          ) : (
            <div></div>
          )}
       </div>

        <i id="report-dropdown-icon"  class="bi bi-chevron-down"></i>
        <i id="report-dropup-icon"  class="bi bi-chevron-up"></i>
        </div>
        </div>
        
      </div>
      </div>
     
     
  );
}

export default XReports;
