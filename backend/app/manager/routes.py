from . import manager_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

newPull=False

def date_pull():
    global newPull
    #date
    currDate=db.session.execute(
    text("""SELECT order_date_time FROM "order" WHERE order_id = (SELECT max(order_id) FROM "order");""")
    ).fetchall()

    data=request.data.decode("utf-8")
    if (data=="PULL"):
         newPull=True
    if newPull:
        queryTime=str(currDate[0][0])
    else:
        queryTime=str(currDate[0][0])[0:10] + " 00:00:00"
    return queryTime

@manager_bp.route('/xzreports', methods=['GET','POST'])
def xreports_data():
    queryTime=date_pull()
    currDay=queryTime[5:10]  + "-" + queryTime[0:4]
    currHour=int(queryTime[11:13])-9
    
    
    #Total sales
    dailySales= db.session.execute(
    text(f"""SELECT SUM(total_price) FROM "order" WHERE order_date_time > '{queryTime}';""")
    ).fetchall()
    
    #total orders
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
    #Orders by hour for table
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
    #Top products
    productsQuery= db.session.execute(
    text(f""" SELECT product_name, COUNT(product_name) FROM "order" o 
         LEFT JOIN order_menu_item om ON o.order_id=om.order_id 
         LEFT JOIN order_menu_item_product p ON om.order_menu_item_id=p.order_menu_item_id 
         JOIN product_item pi ON p.product_id=pi.product_id 
         WHERE order_date_time > '{queryTime}' 
         GROUP BY (product_name) ORDER BY count(product_name) DESC LIMIT 5;
         """)
    ).fetchall()
    
    pieArr=[]
    pieDict={}
    newName=""
    for row in productsQuery:
        newName=""
        lower=True
        for char in row[0]:
            if (str(char).isupper()):
                newName+=" "
                newName+=char
            elif(lower):
                newName+=char
        newNameFinal=newName[0].upper() + newName[1:]
        pieDict["name"]=newNameFinal
        pieDict["value"]=int(row[1])
        pieArr+=[pieDict]
        pieDict={}
   
    returnDict={"date":currDay, 
                "hour":currHour,
                "sales":sales,
                "orderNum":orderNum,
                "ordersByHour":ordersByHour,
                "chartArr":chartArr,
                "pieArr": pieArr
                }
    return returnDict