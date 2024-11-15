from . import manager_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

@manager_bp.route('/xreports', methods=['GET'])
def xreports_data():
    #date
    currDate= db.session.execute(
    text("""SELECT order_date_time FROM "order" WHERE order_id = (SELECT max(order_id) FROM "order");""")
    ).fetchall()
    currDay=str(currDate[0][0])[5:10]  + "-" + str(currDate[0][0])[0:4]
    currHour=int(str(currDate[0][0])[11:13])-9
    queryDate=str(currDate[0][0])[0:10]

    #Total sales
    dailySales= db.session.execute(
    text(f"""SELECT SUM(total_price) FROM "order" WHERE DATE_TRUNC('day', order_date_time) = '{queryDate}';""")
    ).fetchall()

    #total orders
    sales="$" + str(dailySales[0][0])
    ordersQuery= db.session.execute(
    text(f"""SELECT COUNT(order_id) FROM "order" WHERE DATE_TRUNC('day', order_date_time) = '{queryDate}';""")
    ).fetchall()
    orderNum=str(ordersQuery[0][0])

    #Orders by hour for table
    ordersQuery= db.session.execute(
    text(f"""
         SELECT DATE_PART('hour',order_date_time), count(order_id), sum(total_price)
        FROM "order" WHERE DATE_TRUNC('day',order_date_time) = '{queryDate}'
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
                 totSales+=float(row[i])
                 chartDict["sales"]=totSales
        chartArr+=[chartDict]
        ordersByHour+=[rowArr]
    #Top products
    productsQuery= db.session.execute(
    text("""SELECT count(product_id), product_id 
            FROM order_menu_item_product 
            GROUP BY product_id 
            ORDER BY count(product_id) LIMIT 5;
         """)
    ).fetchall()
    productsStr=str(productsQuery)
    #Top employees
     #SELECT COUNT(order_id),employee_id FROM "order" GROUP BY employee_id LIMIT 5;
    returnDict={"date":currDay, 
                "hour":currHour,
                "sales":sales,
                "orderNum":orderNum,
                "ordersByHour":ordersByHour,
                "chartArr":chartArr,
                "products":productsStr
                }
    return returnDict
