from . import manager_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db
from flask import jsonify, request
from app.extensions import db
from app.models import ProductItem, OrderMenuItem, OrderMenuItemProduct, Order, MenuItem, Employee
from sqlalchemy import func
from app.models import ProductItem
from datetime import datetime
from sqlalchemy import text
import re
from random import randrange

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
    """
    Retrieve X and Z report data.
    ---
    tags:
      - Manager
      - Reports
    responses:
      200:
        description: X and Z report data retrieved successfully.
      500:
        description: Internal server error while fetching report data.
    """
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
    """
    Retrieve product pairing reports.
    ---
    tags:
      - Manager
      - Reports
    responses:
      200:
        description: Product pairing reports retrieved successfully.
      500:
        description: Internal server error while fetching reports.
    """
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
    

@manager_bp.route('/', methods=['GET'])
def manager_dashboard():
    """
    Manager dashboard view.
    ---
    tags:
      - Manager
    responses:
      200:
        description: Welcome message for the Manager View.
    """
    return {"message": "Welcome to the Manager View"}


@manager_bp.route('/inventory', methods=["GET"])
def inventory_items():
    """
    Retrieve all inventory items.
    ---
    tags:
      - Manager
      - Inventory
    responses:
      200:
        description: A list of all inventory items.
      500:
        description: Internal server error.
    """
    try:
        with db.session.begin():
            product_inventory = db.session.query(ProductItem).with_entities(ProductItem.product_name, ProductItem.quantity_in_cases).order_by(ProductItem.product_id).all()

        inventory_data = [
            {"name": name_helper(product.product_name), "inventoryRemaining": product.quantity_in_cases} for product in product_inventory
        ]
        return jsonify(inventory_data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {}

@manager_bp.route('/inventory/low', methods=["GET"])
def inventory_items_low():
    try:
        with db.session.begin():
            product_inventory = db.session.query(ProductItem).with_entities(ProductItem.product_name, ProductItem.quantity_in_cases).filter(ProductItem.quantity_in_cases < 5).order_by(ProductItem.product_id).all()

        inventory_data = [
            {"name": name_helper(product.product_name), "inventoryRemaining": product.quantity_in_cases} for product in product_inventory
        ]
        return jsonify(inventory_data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {}

@manager_bp.route('/inventory/restock', methods=["POST"])
def restock():
    """
    Restock a specific inventory item.
    ---
    tags:
      - Manager
      - Inventory
    parameters:
      - in: body
        name: restock
        description: Details of the item to restock.
        required: true
        schema:
          type: object
          properties:
            itemName:
              type: string
              example: "Fried Rice"
            amount:
              type: integer
              example: 10
    responses:
      200:
        description: Item restocked successfully.
      400:
        description: Invalid item name or amount.
      404:
        description: Item not found.
      500:
        description: Internal server error while restocking.
    """
    try:
        data = request.get_json()
        item_name = to_camel_case(data.get('itemName'))
        amount = data.get('amount')

        if not item_name or not amount or not isinstance(amount, int) or amount <= 0:
            return jsonify({"error": "Invalid item name or amount"}), 400

        with db.session.begin():
            item = db.session.query(ProductItem).filter_by(product_name=item_name).first()

            if not item:
                return jsonify({"error": "Item not found"}), 404

            item.quantity_in_cases += amount

            db.session.commit()

        return {}

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while restocking inventory"}), 500


@manager_bp.route('/inventory/restock/low', methods=["POST"])
def restock_low():
    """
    Restock all low inventory items to minimum threshold.
    ---
    tags:
      - Manager
      - Inventory
    responses:
      200:
        description: Low inventory items restocked successfully.
      500:
        description: Internal server error while restocking.
    """
    try:
        with db.session.begin():
            product_inventory = db.session.query(ProductItem).filter(ProductItem.quantity_in_cases < 5).all()

            for item in product_inventory:
                item.quantity_in_cases = 5

            db.session.commit()

        return {}

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while restocking inventory"}), 500


@manager_bp.route('/productUsage', methods=["POST"])
def product_usage_info():
    """
    Retrieve product usage data within a specified date range.
    ---
    tags:
      - Manager
      - Reports
    parameters:
      - in: body
        name: date_range
        description: Start and end dates for product usage analysis.
        required: true
        schema:
          type: object
          properties:
            startDate:
              type: string
              format: date-time
              example: "2024-01-01T00:00:00"
            endDate:
              type: string
              format: date-time
              example: "2024-01-31T23:59:59"
    responses:
      200:
        description: Successfully retrieved product usage data.
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  productName:
                    type: string
                    example: "Orange Chicken"
                  servingsUsed:
                    type: integer
                    example: 120
      500:
        description: Internal server error while retrieving product usage data.
    """
    try:
        data = request.get_json()
        start = convert_to_postgres_timestamp(data.get("startDate"))
        end = convert_to_postgres_timestamp(data.get("endDate"))
        
        query = """
                    SELECT 
                        p.product_name, 
                        SUM(
                            CASE 
                                WHEN mi.item_name = 'appetizerMedium' THEN 2 
                                WHEN mi.item_name = 'appetizerLarge' THEN 3 
                                WHEN mi.item_name = 'aLaCarteMedium' THEN 2 
                                WHEN mi.item_name = 'aLaCarteLarge' THEN 3 
                                WHEN mi.item_name = 'drinkMedium' THEN 2 
                                WHEN mi.item_name = 'drinkLarge' THEN 3 
                                ELSE 1 
                            END
                        ) AS total_servings_used 
                    FROM 
                        order_menu_item_product omip
                    JOIN 
                        product_item p ON omip.product_id = p.product_id
                    JOIN 
                        order_menu_item omi ON omip.order_menu_item_id = omi.order_menu_item_id
                    JOIN 
                        menu_item mi ON omi.menu_item_id = mi.menu_item_id
                    JOIN 
                        "order" o ON omi.order_id = o.order_id
                    WHERE 
                        o.order_date_time BETWEEN :start_date AND :end_date
                    GROUP BY 
                        p.product_name
                """
        results = db.session.execute(
                    text(query), 
                    {'start_date': start, 'end_date': end}
                ).fetchall()
        
        usage = [
            {"productName": name_helper(row[0]), "servingsUsed": row[1]}for row in results
        ]

        return jsonify(usage)
    
    except Exception as e:
        print(f"Error: {e}")


@manager_bp.route('/products', methods=["GET"])
def get_products():
    """
    Retrieve all product details.
    ---
    tags:
      - Manager
      - Products
    responses:
      200:
        description: A list of all products.
      500:
        description: Internal server error.
    """
    try:
        with db.session.begin():
            products = db.session.query(ProductItem).with_entities( 
                        ProductItem.product_id,
                        ProductItem.product_name,
                        ProductItem.type,
                        ProductItem.is_seasonal,
                        ProductItem.is_available,
                        ProductItem.servings_remaining,
                        ProductItem.allergens,
                        ProductItem.display_icons,
                        ProductItem.product_description,
                        ProductItem.premium_addition,
                        ProductItem.serving_size,
                        ProductItem.calories,
                        ProductItem.saturated_fat,
                        ProductItem.carbohydrate,
                        ProductItem.protein,
                        ProductItem.image,
                        ProductItem.is_premium,
                        ProductItem.cost_per_case).order_by(ProductItem.product_id).all()

        product_data = [
            {   "product_id": product.product_id,
                "product_name": name_helper(product.product_name),
                "type": product.type,
                "is_seasonal": product.is_seasonal,
                "is_available": product.is_available,
                "servings_remaining": product.servings_remaining,
                "allergens": product.allergens,
                "display_icons": product.display_icons,
                "product_description": product.product_description,
                "premium_addition": product.premium_addition,
                "serving_size": product.serving_size,
                "calories": product.calories,
                "saturated_fat": product.saturated_fat,
                "carbohydrate": product.carbohydrate,
                "protein": product.protein,
                "image": product.image,
                "is_premium": product.is_premium,
                "cpc": product.cost_per_case} for product in products
        ]
        return jsonify(product_data)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {}


@manager_bp.route('/products/update', methods=["POST"])
def update_products():
    """
    Update or add a product.
    ---
    tags:
      - Manager
      - Products
    parameters:
      - in: body
        name: product
        description: Details of the product to update or add.
        required: true
        schema:
          type: object
          properties:
            product_id:
              type: integer
              example: 1
            product_name:
              type: string
              example: "Orange Chicken"
            type:
              type: string
              example: "entree"
    responses:
      200:
        description: Product updated or added successfully.
      500:
        description: Internal server error while updating the product.
    """
    data = request.get_json()
    id = data.get("product_id")
    try:
        with db.session.begin():
            product = db.session.query(ProductItem).filter_by(product_id=id).first()

            if product:
                product.product_name = to_camel_case(data.get("product_name"))
                product.type = data.get("type")
                product.is_seasonal = data.get("is_seasonal")
                product.is_available = data.get("is_available")
                product.servings_remaining = data.get("servings_remaining")
                product.allergens = data.get("allergens")
                product.display_icons = data.get("display_icons")
                product.product_description = data.get("product_description")
                product.premium_addition = data.get("premium_addition")
                product.serving_size = data.get("serving_size")
                product.calories = data.get("calories")
                product.saturated_fat = data.get("saturated_fat")
                product.carbohydrate = data.get("carbohydrate")
                product.protein = data.get("protein")
                product.image = data.get("image")
                product.is_premium = data.get("is_premium")
                product.cost_per_case = data.get("cpc")
            else:
                new_product = ProductItem(
                    product_name = to_camel_case(data.get("product_name")),
                    type = data.get("type"),
                    is_seasonal = data.get("is_seasonal"),
                    is_available = data.get("is_available"),
                    servings_remaining = data.get("servings_remaining"),
                    allergens = data.get("allergens"),
                    display_icons = data.get("display_icons"),
                    product_description = data.get("product_description"),
                    premium_addition = data.get("premium_addition"),
                    serving_size = data.get("serving_size"),
                    calories = data.get("calories"),
                    saturated_fat = data.get("saturated_fat"),
                    carbohydrate = data.get("carbohydrate"),
                    protein = data.get("protein"),
                    image = data.get("image"),
                    is_premium = data.get("is_premium"),
                    quantity_in_cases = 0,
                    servings_per_case = 50,
                    cost_per_case = data.get("cpc")
                )
                db.session.add(new_product)

            db.session.commit()
        return {}
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return {}


@manager_bp.route('/products/delete', methods=["POST"])
def delete_products():
    """
    Delete a product.
    ---
    tags:
      - Manager
      - Products
    parameters:
      - in: body
        name: product_id
        description: ID of the product to delete.
        required: true
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
    responses:
      200:
        description: Product deleted successfully.
      500:
        description: Internal server error while deleting the product.
    """
    data = request.get_json()
    id = data.get("id")
    try:
        with db.session.begin():
            product = db.session.query(ProductItem).filter_by(product_id=id).first()
            db.session.delete(product)
        return {}
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
        return {}


def name_helper(text):
    words = re.findall(r'[A-Z][a-z]*|[a-z]+', text)
    return ' '.join(word.capitalize() for word in words)


def convert_to_postgres_timestamp(iso_timestamp):
    try:
        parsed_time = datetime.strptime(iso_timestamp, "%Y-%m-%dT%H:%M")
        postgres_timestamp = parsed_time.strftime("%Y-%m-%d %H:%M:%S")
        return postgres_timestamp
    except ValueError as e:
        return f"Error: {e}"


def to_camel_case(input_string):
    words = input_string.split()
    camel_case_string = words[0].lower()
    for word in words[1:]:
        camel_case_string += word.capitalize()
    return camel_case_string


@manager_bp.route('/salesreports', methods=['POST'])
def salesReport():
    """
    Retrieve sales reports for a specified date range.
    ---
    tags:
      - Manager
      - Reports
    parameters:
      - in: body
        name: date_range
        description: Start and end dates for the sales report.
        required: true
        schema:
          type: object
          properties:
            startDate:
              type: string
              format: date-time
              example: "2024-01-01T00:00:00"
            endDate:
              type: string
              format: date-time
              example: "2024-01-31T23:59:59"
    responses:
      200:
        description: Successfully retrieved sales report.
        content:
          application/json:
            schema:
              type: object
              properties:
                totalSales:
                  type: string
                  example: "$10,000.00"
                totalOrders:
                  type: string
                  example: "150"
                histogram:
                  type: array
                  items:
                    type: object
                    properties:
                      category:
                        type: string
                        example: "Orange Chicken"
                      count:
                        type: integer
                        example: 50
                      sales:
                        type: string
                        example: "$500.00"
                product1:
                  type: object
                  properties:
                    name:
                      type: string
                      example: "Orange Chicken"
                    count:
                      type: integer
                      example: 100
                product2:
                  type: object
                  properties:
                    name:
                      type: string
                      example: "Beef Broccoli"
                    count:
                      type: integer
                      example: 80
      500:
        description: Internal server error while retrieving sales report.
    """
    datesSelected = request.get_json()

    start_date = datesSelected['startDate']
    end_date = datesSelected['endDate']

    output = {}

    top_products = db.session.query(
        ProductItem.product_name,
        func.count(ProductItem.product_id).label('product_count')
    ).join(
        OrderMenuItemProduct, ProductItem.product_id == OrderMenuItemProduct.product_id
    ).join(
        OrderMenuItem, OrderMenuItemProduct.order_menu_item_id == OrderMenuItem.order_menu_item_id
    ).join(
        Order, OrderMenuItem.order_id == Order.order_id
    ).filter(
        Order.order_date_time >= start_date,
        Order.order_date_time <= end_date
    ).group_by(
        ProductItem.product_id
    ).order_by(
        func.count(ProductItem.product_id).desc()
    ).limit(5)

    total_sales = db.session.query(
        func.sum(Order.total_price).label('total_sales')
    ).filter(
        Order.order_date_time >= start_date,
        Order.order_date_time <= end_date
    ).scalar()

    total_orders = db.session.query(
        func.count(Order.order_id).label('total_orders')
    ).filter(
        Order.order_date_time >= start_date,
        Order.order_date_time <= end_date
    ).scalar()

    if not top_products:
        for i in range(5):
            output[f"product{i+1}"] = {"name": "N/A", "count": "Null"}
    else:
        i = 1
        for p in top_products:
            output[f"product{i}"] = {"name": name_helper(p.product_name), "count": p.product_count}
            i+=1

        if (i != 5):
            for i in range(i, 6):
                output[f"product{i}"] = {"name": "N/A", "count": "Null"}

    if not total_sales:
        total_sales = "N/A"
    else:
        total_sales = f'${total_sales:,.2f}'
    output["totalSales"] = total_sales

    if not total_orders:
        total_orders = "N/A"
    output["totalOrders"] = total_orders


    menu_items = db.session.query(
        MenuItem.item_name,
        func.count(MenuItem.menu_item_id).label('item_count')
    ).join(
        OrderMenuItem, MenuItem.menu_item_id == OrderMenuItem.menu_item_id
    ).join(
        Order, OrderMenuItem.order_id == Order.order_id
    ).filter(
        Order.order_date_time >= start_date,
        Order.order_date_time <= end_date
    ).group_by(
        MenuItem.menu_item_id
    ).all()

    mi_prices_dict = {}
    mi_prices = db.session.query(MenuItem.item_name, MenuItem.premium_multiplier, MenuItem.menu_item_base_price).all()
    
    for mi in mi_prices:
        mi_prices_dict[mi.item_name] = mi.menu_item_base_price + 1.50*mi.premium_multiplier 

    if not menu_items:
        output["histogram"] =  [{ "category": "N/A", "count": 0, "sales": "$0.00"}, 
                                { "category": "N/A", "count": 0, "sales": "$0.00"},
                                { "category": "N/A", "count": 0, "sales": "$0.00"},
                                { "category": "N/A", "count": 0, "sales": "$0.00"},
                                { "category": "N/A", "count": 0, "sales": "$0.00"}] 
    else:
        menuItemList = []
        for m in menu_items:
            menuItemList += [{"category": name_helper(m.item_name), "count": m.item_count, "sales": f'${mi_prices_dict[m.item_name]*m.item_count:,.2f}'}]
        output["histogram"] = menuItemList
    
    return jsonify(output)


@manager_bp.route('/employee/get', methods=['GET'])
def getEmployees():
    """
    Retrieve all employees.
    ---
    tags:
      - Manager
      - Employees
    responses:
      200:
        description: A list of all employees.
      500:
        description: Internal server error while fetching employees.
    """
    employees = db.session.query(Employee.employee_id, Employee.first_name, Employee.last_name, Employee.email, Employee.role).all()

    employee_list = []

    if not employees:
        employee_list = [{"id":"error", "name":"error", "email":"error", "role":"error"}]
    else:
        for employee in employees:
            employee_list += [{"id":employee.employee_id, "name":f'{employee.first_name} {employee.last_name}', "email":employee.email, "role":employee.role, "first_name": employee.first_name, "last_name": employee.last_name}]
    
    return jsonify(employee_list)


@manager_bp.route('/employee/fire', methods=['POST'])
def fireEmployee():
    """
    Fire an employee by updating their role to 'fired'.
    ---
    tags:
      - Manager
      - Employees
    parameters:
      - in: body
        name: employee_id
        description: ID of the employee to be fired.
        required: true
        schema:
          type: string
          example: "123456"
    responses:
      200:
        description: Employee successfully fired.
      404:
        description: Employee not found.
    """
    id = request.get_data()
    id = id.decode('utf-8')

    print(id)

    employee = Employee.query.filter_by(employee_id=id).first()

    if employee:
        employee.role = "fired"

        db.session.commit()
    
    return {200: "Successfully fired employee"}


@manager_bp.route('/employee/email', methods=['POST'])
def checkEmail():
    """
    Check if an email exists in the employee database.
    ---
    tags:
      - Manager
      - Employees
    parameters:
      - in: body
        name: email
        description: Email address to check.
        required: true
        schema:
          type: string
          example: "john.doe@example.com"
    responses:
      200:
        description: True if email does not exist; False otherwise.
    """
    employeeEmail = request.get_data()
    employeeEmail = employeeEmail.decode('utf-8')

    #returns instance of customer model
    employee = Employee.query.filter_by(email=employeeEmail).first()

    if (employee == None):
        return jsonify(True)
    else:
        return jsonify(False)


@manager_bp.route('/employee/addemail', methods=['POST'])
def addEmailCheck():
    """
    Check if an email can be added (maximum of one duplicate allowed).
    ---
    tags:
      - Manager
      - Employees
    parameters:
      - in: body
        name: email
        description: Email address to check for duplicates.
        required: true
        schema:
          type: string
          example: "john.doe@example.com"
    responses:
      200:
        description: True if the email can be added; False otherwise.
    """
    employeeEmail = request.get_data()
    employeeEmail = employeeEmail.decode('utf-8')

    #returns instance of customer model
    employees = Employee.query.filter_by(email=employeeEmail).all()
    count = len(employees)
    # for employee in employees:
    #     count += 1
    if (count == 0 or count == 1):
        return jsonify(True)
    else:
        return jsonify(False)


@manager_bp.route('/employee/add', methods=['POST'])
def addEmployee():
    """
    Add a new employee.
    ---
    tags:
      - Manager
      - Employees
    parameters:
      - in: body
        name: employee
        description: Employee details.
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: "john.doe@example.com"
            password:
              type: string
              example: "securepassword123"
            first_name:
              type: string
              example: "John"
            last_name:
              type: string
              example: "Doe"
            role:
              type: string
              example: "cashier"
    responses:
      200:
        description: Employee added successfully.
      500:
        description: Internal server error while adding the employee.
    """
    data = request.get_json()

    employee_ids = db.session.query(Employee.employee_id).all()

    employee_id_list = [employee.employee_id for employee in employee_ids]

    random_id = randrange(100000, 1000000)
    while random_id in employee_id_list:
        random_id = randrange(0, 1000000)

    new_employee = Employee(employee_id=random_id, email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'], role=data['role'])
    db.session.add(new_employee)
    db.session.commit()

    return jsonify({"message": "employee data received"}), 200


@manager_bp.route('/employee/edit', methods=['POST'])
def editEmployee():
    """
    Edit an existing employee's details.
    ---
    tags:
      - Manager
      - Employees
    parameters:
      - in: body
        name: employee
        description: Employee details to update.
        required: true
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 123456
            email:
              type: string
              example: "john.doe@example.com"
            first_name:
              type: string
              example: "John"
            last_name:
              type: string
              example: "Doe"
            role:
              type: string
              example: "manager"
    responses:
      200:
        description: Employee updated successfully.
      404:
        description: Employee not found.
      500:
        description: Internal server error while updating the employee.
    """
    data = request.get_json()

    employee = db.session.query(Employee).filter_by(employee_id=data["id"]).first()

    # If the employee is not found, return a 404 error
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    setattr(employee, "email", data["email"])
    setattr(employee, "first_name", data["first_name"])
    setattr(employee, "last_name", data["last_name"])
    setattr(employee, "role", data["role"])

    db.session.commit()

    return jsonify({"message": "Employee updated successfully", "employee": {
            "employee_id": employee.employee_id,
            "email": employee.email,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "role": employee.role
        }}), 200