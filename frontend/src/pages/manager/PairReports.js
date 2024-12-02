import React, { useState, useEffect } from "react";
import api from '../../services/api'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import {format,fromZonedTime} from 'date-fns-tz';


function PairReports() {
    const [PairReportsData, setPairReportsData] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const fetchPairReport = async () => {
      const response = await api.get('/manager/pairreports',{timeout: 60000}); 
      setPairReportsData(response.data);
      
      
    };
    const calcColor = (value,max) => {
    let color=`rgb(${255},${255},${255})`;
    if (parseFloat(max)!=0){
    const colorOffset= parseFloat(value)/parseFloat(max);
    color=`rgb(${255-92*colorOffset},${255-247*colorOffset},${255-243*colorOffset})`
    }
    return color;
    }

    const calcDate = (date) => {
      const zone=Intl.DateTimeFormat().resolvedOptions.timeZone;
      const newDate=format(fromZonedTime(date,zone),"yyyy-MM-dd HH:mm:ss");
      return newDate;
    }
    const changeStart = async (date) => {
      setStartDate(date);
      const newDate=calcDate(date);
      await api.post('/manager/pairreports', {sDate: newDate})
      fetchPairReport();
    };

    const changeEnd = async (date) => {
      setEndDate(date);
      const newDate=calcDate(date);
      await api.post('/manager/pairreports', {eDate: newDate})
      fetchPairReport();
    };

    useEffect(() => {
      const initStartDate=calcDate(startDate);
      const initEndDate=calcDate(endDate);
      api.post('/manager/pairreports', {sDate: initStartDate});
      api.post('/manager/pairreports', {eDate: initEndDate});
      fetchPairReport();
        
        
      }, []); 
     return (
        
      
      <div class="reports-background-container"> 
      <SidebarManager></SidebarManager>
      <div class="reports-background"> 
      <div class="title-container">
      <div class="reports-title">
        Paired Products Report
      </div>
      </div>
      <hr class="report-divider-big"></hr>
      <div class="report-container">
      <div class="report-card-pair">
          Start Date:
          <DatePicker
          id ="date-pair"
          selected={startDate}
          onChange={changeStart}
          dateFormat="MM/dd/yyyy hh:mm:aa"
          showTimeSelect
          />
          
      </div>
      <div class="report-card-pair">
          End Date:
          <DatePicker
          id ="date-pair"
          selected={endDate}
          onChange={changeEnd}
          dateFormat="MM/dd/yyyy hh:mm:aa"
          showTimeSelect
          />
          
      </div>
      </div>
      <div class="report-container">

      <div class="report-card-large">
      Product Pair Frequency
      <hr class="report-divider"></hr>
      <div class="pair-chart-container">
      
      {PairReportsData ? (
        <div>
          {PairReportsData.productsArrReverse.map((name,nameRow) => (
            <div class="pair-yaxis-name"
            key={nameRow}
            >
            {name}
            </div>
            ))}

        </div>
      ):(
      <div></div>
      )}

      {PairReportsData ? (
        <div class="pair-back"> 
          
          {PairReportsData.pairChart.map((item, elemRow ) => (
          <div class="pair-row"
            key={elemRow}
          >
            {item.map((elem,elemInd) =>(
              <div class="pair-elem"
              key={elemInd}
              style={{
              backgroundColor: calcColor(elem,PairReportsData.maxPair)
              }}
              >
            </div>
            ))}
          </div>
        ))}
          </div>

      ) : (
        <div></div>
      )}
      
     
      </div>
      <div class="pair-xaxis">
      {PairReportsData ? (
        <div>
          {PairReportsData.productsArr.map((name,nameRow) => (
            <div class="pair-xaxis-name"
            key={nameRow}
            >
            {name}
            </div>
            ))}

        </div>
      ):(
      <div></div>
      )}
      </div>

      </div>
      <div class="report-card-large">
      Popular Product Pairs
      <hr class="report-divider"></hr>

      {PairReportsData ? (
        <div> 
            <div class="pair-table-title-container">
                <div class="pair-table-title">Product X </div>
                <div class="pair-table-title">Product Y </div>
                <div class="pair-table-title">Order Count </div>
                <div class="pair-table-title">% of Orders </div>
            </div>
          {PairReportsData.tableArr.map((item, elemRow ) => (
          <div
            key={elemRow}
            class="pair-table-row"
          >
            {item.map((elem,elemInd) =>(
              <div
              key={elemInd}
              class="pair-table-elem"
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
      </div>

      </div>
      </div>
     
     
  );
}

export default PairReports;
