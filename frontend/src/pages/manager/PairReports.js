import React, { useState, useEffect } from "react";
import api from '../../services/api'; 

import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import {ResponsiveContainer,LineChart,Line,XAxis,YAxis, PieChart, Pie,  Cell, Legend } from 'recharts';

function ZReports() {
 

  
  return (
        
      
      <div class="reports-background-container"> 
      <SidebarManager></SidebarManager>
      <div class="reports-background"> 
      <div class="title-container">
      <div class="reports-title">
        Paired Products Report
      </div>
      </div>
      </div>
      </div>
     
     
  );
}

export default ZReports;
