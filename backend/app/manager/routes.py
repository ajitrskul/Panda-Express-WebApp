from . import manager_bp
from flask import jsonify, request
from app.extensions import db
from app.models import ProductItem, OrderMenuItem, OrderMenuItemProduct, Order, MenuItem, Employee
from sqlalchemy import func
import re
from random import randrange

@manager_bp.route('/', methods=['GET'])
def manager_dashboard():
    return {"message": "Welcome to the Manager View"}

@manager_bp.route('/inventory', methods=["GET"])
def inventory_items():
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

@manager_bp.route('/inventory/restock', methods=["POST"])
def restock():
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


def name_helper(text):
    words = re.findall(r'[A-Z][a-z]*|[a-z]+', text)
    return ' '.join(word.capitalize() for word in words)

def to_camel_case(input_string):
    words = input_string.split()
    camel_case_string = words[0].lower()
    for word in words[1:]:
        camel_case_string += word.capitalize()
    return camel_case_string

@manager_bp.route('/salesreports', methods=['POST'])
def salesReport():
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