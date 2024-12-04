from . import manager_bp
from flask import jsonify, request
from app.extensions import db
from app.models import ProductItem, OrderMenuItem, OrderMenuItemProduct, Order, MenuItem
from sqlalchemy import func
import re

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
