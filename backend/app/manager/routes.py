from . import manager_bp
from flask import jsonify, request
from app.extensions import db
from app.models import ProductItem
from datetime import datetime
from sqlalchemy import text
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
    try:
        with db.session.begin():
            product_inventory = db.session.query(ProductItem).with_entities(ProductItem.product_name, ProductItem.quantity_in_cases).filter(ProductItem.quantity_in_cases < 5).all()

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
