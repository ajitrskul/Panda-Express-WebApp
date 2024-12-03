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
  const [axisArr,setAxisArr] = useState(null)
  const [displayPair,setDisplayPair] = useState("Click Cell To See Product Pair")
  const [displayPairTotal,setDisplayPairTotal] = useState("Click Cell To See Product Pair Order Total")
  /*Display product pair when square is clicked*/
  const clickSquare = (row,col,value) =>{
    setAxisArr(PairReportsData.axisArr);
    if (axisArr){
      const display=(axisArr[parseInt(row)][parseInt(col)])
      const orders="Total Orders: " + parseInt(value);
      setDisplayPair(display)
      setDisplayPairTotal(orders);
      }
  }
  /*Fetch from the database*/
  const fetchPairReport = async () => {
    const response = await api.get('/manager/pairreports',{timeout: 60000}); 
    setPairReportsData(response.data);
    
  };

  /*Calculate color for chart*/
  const calcColor = (value,max) => {
    let color=`rgb(${255},${255},${255})`;
    
    if (parseFloat(max)!==0){
      const colorOffset= parseFloat(value)/parseFloat(max);
      color=`rgb(${255-92*colorOffset},${255-247*colorOffset},${255-243*colorOffset})`;
    }
    
    return color;
  }

  /*Calculate  date based on time zone*/
  const calcDate = (date) => {
    const zone=Intl.DateTimeFormat().resolvedOptions.timeZone;
    const newDate=format(fromZonedTime(date,zone),"yyyy-MM-dd HH:mm:ss");
    return newDate;
  }

  /*Change start date*/
  const changeStart = async (date) => {
    setStartDate(date);
    const newDate=calcDate(date);
    try{
      await api.post('/manager/pairreports', {sDate: newDate},{timeout: 60000})
      fetchPairReport();
    }
    catch{
      window.location.reload();
    }
  };

  /*Change end date*/
  const changeEnd = async (date) => {
    setEndDate(date);
    const newDate=calcDate(date);
    try{
      await api.post('/manager/pairreports', {eDate: newDate},{timeout: 60000})
      fetchPairReport();
    }
    catch{
      window.location.reload();
    }
  };

  /*Get chart and table for initial dates*/
  useEffect(() => {
    const initStartDate=calcDate(startDate);
    const initEndDate=calcDate(endDate);
    api.post('/manager/pairreports', {sDate: initStartDate}, {timeout: 60000});
    api.post('/manager/pairreports', {eDate: initEndDate}, {timeout: 60000});
    fetchPairReport();
  },[startDate,endDate]); 

  return (
    <div class="reports-background-container"> 
      <SidebarManager></SidebarManager>
      <div class="reports-background"> 
        {/*Title*/}
        <div class="title-container">
          <div class="reports-title">Paired Products Report</div>
        </div>
        <hr class="report-divider-big"></hr>

         {/*Date Pickers*/}
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

         
        <div class="report-container-pair">
          {/*Product Frequency Chart*/}
          <div class="report-card-large">
          Product Pair Frequency
          <hr class="report-divider"></hr>
          
              {PairReportsData ? (
              <div>
              <div class="pair-chart-title">{displayPair}</div>
              <div class="pair-chart-title">{displayPairTotal}</div>
              </div>
              ):(
              <div></div>
              )}
            
            <div class="pair-chart-container">
              {PairReportsData ? (
                <div class="pair-yaxis">
                  Products

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
                      <div class="pair-elem" id="pair-elem"  onClick={() => clickSquare(elemRow,elemInd,elem)}
                      key={elemInd}
                      style={{
                      backgroundColor: calcColor(elem,PairReportsData.maxPair)
                      }}
                      >
                    </div>
                    ))}
                  </div>
                ))}

                    <div class="pair-xaxis">
                    Products
                    </div>
                  </div>

              ) : (
                <div></div>
              )}

            </div>
          </div>
           {/*Product Pair table*/}
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
