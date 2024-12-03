from . import manager_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

# Global Variables used for resetting X and Z Reports
newZ=False
zLeave=False
startDatePair="2024-09-23 00:00:00"
endDatePair="2024-09-23 00:00:00"

def date_pull():
    # Check variables that reset X and Z reports
    global newZ
    global zLeave
    # Find max date in database, to get X Reports Data
    currDate=db.session.execute(
    #text("""SELECT order_date_time FROM "order" WHERE order_id = (SELECT max(order_id) FROM "order");""")
    text(""" SELECT max(order_date_time) FROM "order";""")
    ).fetchall()

    # Reset X and Z Reports, if Z Reports are clicked and another page is clicked
    # This happens by pulling all order data > than the latest order time stamp 
    # (which will return nothing)
    data=request.data.decode("utf-8")
    if (data=="Z"):
         newZ=True
    if (data=="LEAVE"):
         zLeave=True
    if newZ and zLeave:
        queryTime=str(currDate[0][0])
    elif zLeave:
        zLeave=False
        queryTime=str(currDate[0][0])[0:10] + " 00:00:00"
    else:
        queryTime=str(currDate[0][0])[0:10] + " 00:00:00"
    hourDate=str(currDate[0][0])
    return [queryTime,hourDate]

@manager_bp.route('/xzreports', methods=['GET','POST'])
def xreports_data():
    queryTime=(date_pull())[0]
    hourDate=(date_pull())[1]
    currDay=queryTime[5:10]  + "-" + queryTime[0:4]
    currHour=int(hourDate[11:13])-9
    
    # Query Total sales
    dailySales= db.session.execute(
    text(f"""SELECT SUM(total_price) FROM "order" WHERE order_date_time > '{queryTime}';""")
    ).fetchall()
    
    # Query total orders
    sales="$" + str(dailySales[0][0])

    ordersQuery= db.session.execute(
    text(f"""SELECT COUNT(order_id) FROM "order" WHERE order_date_time > '{queryTime}';""")
    ).fetchall()
    orderNum=str(ordersQuery[0][0])
    if (int(orderNum)==0):
        currDay=""
        currHour=""
        sales=""
        orderNum=""
    # Query orders by hour for table
    ordersQuery= db.session.execute(
    text(f"""
         SELECT DATE_PART('hour',order_date_time), count(order_id), sum(total_price)
        FROM "order" WHERE order_date_time > '{queryTime}'
        GROUP BY DATE_PART('hour',order_date_time) 
        ORDER BY DATE_PART('hour', order_date_time)
         ;""")
    ).fetchall()
    ordersByHour=[]
    dataArr=[]
    rowArr=[]
    chartArr=[]
    chartDict={}
    totSales=0

    # Format Orders by Hour Table
    if (len(ordersQuery)!=0):
        for row in ordersQuery:
            rowArr=[]
            chartDict={}
            for i in range (0,3):
                if (i==0):
                    if (int(row[i])<12):
                        rowArr+=[str(int(row[i])) + ":00 AM"]
                        chartDict["hour"]=rowArr[0]
                    elif (int(row[i])==12):
                        rowArr+=[str(int(row[i])) + ":00 PM"]
                        chartDict["hour"]=rowArr[0]
                    else:
                        rowArr+=[str(int(row[i])-12) + ":00 PM"]
                        chartDict["hour"]=rowArr[0]
                elif (i==1):
                    rowArr+=[str(int(row[i])) + " "]
                    
                else:
                    rowArr+=[ "$" + str(row[i])]
                    totSales=float(row[i])
                    chartDict["sales"]=totSales
            chartArr+=[chartDict]
            ordersByHour+=[rowArr]
    else:
        ordersByHour=[["..."]*3 for _ in range(1)]
    # Query top 5 products
    productsQuery= db.session.execute(
    text(f""" SELECT product_name, COUNT(product_name) FROM "order" o 
         LEFT JOIN order_menu_item om ON o.order_id=om.order_id 
         LEFT JOIN order_menu_item_product p ON om.order_menu_item_id=p.order_menu_item_id 
         JOIN product_item pi ON p.product_id=pi.product_id 
         WHERE order_date_time > '{queryTime}' 
         GROUP BY (product_name) ORDER BY count(product_name) DESC LIMIT 5;
         """)
    ).fetchall()
    
    # Format pie chart for products
    pieArr=[]
    pieDict={}
    newName=""
    for row in productsQuery:
        newName=""
        for char in row[0]:
            if (str(char).isupper()):
                newName+=" "
                newName+=char
            else:
                newName+=char
        newNameFinal=newName[0].upper() + newName[1:]
        pieDict["name"]=newNameFinal
        pieDict["value"]=int(row[1])
        pieArr+=[pieDict]
        pieDict={}
    
    # Return all data
    returnDict={"date":currDay, 
                "hour":currHour,
                "sales":sales,
                "orderNum":orderNum,
                "ordersByHour":ordersByHour,
                "chartArr":chartArr,
                "pieArr": pieArr
                }
    return returnDict

@manager_bp.route('/pairreports', methods=['GET','POST'])
def pair_reports():
    try:
        # Pull Dates if selected and base queries off new dates
        with db.session.begin():
            data=request.data.decode("utf-8")
            global startDatePair
            global endDatePair
            if (data[2:7]=='sDate'):
                startDatePair=data[10:29]
            if (data[2:7]=='eDate'):
                endDatePair=data[10:29]
            
            # Query for product frequency chart
            pairProductChart=db.session.execute(
            text(f"""
                SELECT count(DISTINCT o.order_id), pi1.product_name, pi2.product_name, pi1.product_id,pi2.product_id
                FROM "order" o 
                JOIN order_menu_item om1 ON o.order_id=om1.order_id 
                JOIN order_menu_item om2 ON o.order_id=om2.order_id 
                JOIN order_menu_item_product p1 ON om1.order_menu_item_id=p1.order_menu_item_id 
                JOIN order_menu_item_product p2 ON om2.order_menu_item_id=p2.order_menu_item_id 
                JOIN product_item pi1 ON p1.product_id=pi1.product_id 
                JOIN product_item pi2 ON p2.product_id=pi2.product_id 
                WHERE o.order_date_time >  '{startDatePair}'
                AND o.order_date_time <  '{endDatePair}'
                GROUP BY pi1.product_id, pi2.product_id
                ORDER BY pi1.product_id DESC;
                """)
            ).fetchall()
            
             # Query for product pair table
            pairProductsTable=db.session.execute(
            text(f"""
                SELECT count(DISTINCT o.order_id), pi1.product_name, pi2.product_name
                FROM "order" o 
                JOIN order_menu_item om1 ON o.order_id=om1.order_id 
                JOIN order_menu_item om2 ON o.order_id=om2.order_id 
                JOIN order_menu_item_product p1 ON om1.order_menu_item_id=p1.order_menu_item_id 
                JOIN order_menu_item_product p2 ON om2.order_menu_item_id=p2.order_menu_item_id 
                JOIN product_item pi1 ON p1.product_id=pi1.product_id 
                JOIN product_item pi2 ON p2.product_id=pi2.product_id 
                WHERE pi1.product_id < pi2.product_id
                AND o.order_date_time >  '{startDatePair}'
                AND o.order_date_time <  '{endDatePair}'
                GROUP BY pi1.product_id, pi2.product_id
                ORDER BY count(DISTINCT o.order_id) DESC LIMIT 10;
                """)
            ).fetchall()
            
             # Query the number total orders in the time window
            totalOrders=db.session.execute(
            text(f"""
                SELECT count(DISTINCT order_id)
                FROM "order"
                WHERE order_date_time >  '{startDatePair}'
                AND order_date_time <  '{endDatePair}';
                """)
            ).fetchall()

             # Query for total number of products
            prodNamesQuery=db.session.execute(
            text(f"""
                SELECT product_name from product_item
                ORDER By product_id;
                """)
            ).fetchall()
            
            # Format Table
            tableArr=[]
            if (len(pairProductsTable)==0):
                tableArr=[["..."]*4 for _ in range(10)]
            else:
                for i in range(len(pairProductsTable)):
                    rowArr=[]
                    newName=""
                    for char in str(str(pairProductsTable[i][1])):
                        if (str(char).isupper()):
                            newName+=" "
                            newName+=char
                        else:
                            newName+=char
                    newNameFinal=newName[0].upper() + newName[1:]
                    rowArr+=[newNameFinal]
                    newName=""
                    for char in str(str(pairProductsTable[i][2])):
                        if (str(char).isupper()):
                            newName+=" "
                            newName+=char
                        else:
                            newName+=char
                    newNameFinal=newName[0].upper() + newName[1:]
                    rowArr+=[newNameFinal]
                    rowArr+=[str(pairProductsTable[i][0])]
                    rowArr+=[str(round(float(pairProductsTable[i][0])/float(totalOrders[0][0])*100)) + "%"]
                    tableArr+=[rowArr]

            productsArr=[]
            productsArrReverse=[]
            prodNums=len(prodNamesQuery)

            # Format X Axis and Y Axis for Chart
            for i in range(prodNums):
                newName=""
                for char in str(prodNamesQuery[i][0]):
                    if (str(char).isupper()):
                        newName+=" "
                        newName+=char
                    else:
                        newName+=char
                newNameFinal=newName[0].upper() + newName[1:]
                productsArr+=[newNameFinal]
                newName=""
                for char in str(prodNamesQuery[prodNums-1-i][0]):
                    if (str(char).isupper()):
                        newName+=" "
                        newName+=char
                    else:
                        newName+=char
                newNameFinal=newName[0].upper() + newName[1:]
                productsArrReverse+=[newNameFinal]
            
            # Format Chart
            crossPlotArr=[[0]*prodNums for _ in range(prodNums)]
            axisArr=[]
            maxPair=0
            for i in range (0,len(pairProductChart)):
                if(int(pairProductChart[i][3])==int(pairProductChart[i][4])):
                    crossPlotArr[prodNums-int(pairProductChart[i][3])][int(pairProductChart[i][4])-1]='0'
                else:
                    crossPlotArr[prodNums-int(pairProductChart[i][3])][int(pairProductChart[i][4])-1]=pairProductChart[i][0]
                    if (int(pairProductChart[i][0])>maxPair):
                        maxPair=int(pairProductChart[i][0])
            
            for product1 in productsArrReverse:
                rowArr=[]
                for product2 in productsArr:
                    rowArr+=[product2 + " + " +product1]
                axisArr+=[rowArr]


            
            # Return all data
            return {"pairChart":crossPlotArr,
                    "maxPair": str(maxPair),
                    "productsArr":productsArr,
                    "productsArrReverse":productsArrReverse,
                    "tableArr":tableArr,
                    "axisArr": axisArr
                    }
        return{}
    except Exception as e:
        db.session.rollback()
        return{}