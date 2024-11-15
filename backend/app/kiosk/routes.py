from . import kiosk_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

from app.models import Order, OrderMenuItem, OrderMenuItemProduct, MenuItem, ProductItem, EmployeeInfo
from datetime import datetime, timezone

@kiosk_bp.route('/', methods=['GET'])
def customer_kiosk_home():
    return {"message": "Welcome to the Customer Kiosk"}

@kiosk_bp.route('/menu', methods=['GET'])
def get_menu_items():
    single_appetizer = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'appetizerSmall' LIMIT 1")
    ).fetchall()

    single_a_la_carte = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'aLaCarteSideMedium' LIMIT 1")
    ).fetchall()

    single_drink = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'drinks' LIMIT 1")
    ).fetchall()

    all_other_items = db.session.execute(
        text("""
            SELECT * FROM menu_item 
            WHERE item_name NOT LIKE 'appetizer%' 
            AND item_name NOT LIKE 'dessert%' 
            AND item_name NOT LIKE 'aLaCarte%'
            AND item_name NOT LIKE 'drinks%'
            ORDER BY menu_item_id ASC
        """)
    ).fetchall()

    menu_items = all_other_items + single_a_la_carte + single_appetizer + single_drink

    menu_items_list = [
        {
            "menu_item_id": menu_item.menu_item_id,
            "item_name": menu_item.item_name,
            "max_entrees": menu_item.max_entrees,
            "max_sides": menu_item.max_sides,
            "menu_item_base_price": menu_item.menu_item_base_price,
            "premium_multiplier": menu_item.premium_multiplier,
            "menu_item_description": menu_item.menu_item_description,
            "calories": menu_item.calories,
            "image": menu_item.image,
        }
        for menu_item in menu_items
    ]

    return jsonify(menu_items_list), 200


@kiosk_bp.route('/sides', methods=['GET'])
def get_sides():
    sides = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'side'}
    ).fetchall()

    sides_list = [
        {
            "product_id": side.product_id,
            "product_name": side.product_name,
            "type": side.type,
            "is_seasonal": side.is_seasonal,
            "is_available": side.is_available,
            "servings_remaining": side.servings_remaining,
            "allergens": side.allergens,
            "display_icons": side.display_icons,
            "product_description": side.product_description,
            "premium_addition": side.premium_addition,
            "serving_size": side.serving_size,
            "calories": side.calories,
            "saturated_fat": side.saturated_fat,
            "carbohydrate": side.carbohydrate,
            "protein": side.protein,
            "image": side.image,
            "is_premium": side.is_premium,
        }
        for side in sides
    ]

    return jsonify(sides_list), 200


@kiosk_bp.route('/entrees', methods=['GET'])
def get_entrees():
    entrees = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'entree'}
    ).fetchall()

    entrees_list = [
        {
            "product_id": entree.product_id,
            "product_name": entree.product_name,
            "type": entree.type,
            "is_seasonal": entree.is_seasonal,
            "is_available": entree.is_available,
            "servings_remaining": entree.servings_remaining,
            "allergens": entree.allergens,
            "display_icons": entree.display_icons,
            "product_description": entree.product_description,
            "premium_addition": entree.premium_addition,
            "serving_size": entree.serving_size,
            "calories": entree.calories,
            "saturated_fat": entree.saturated_fat,
            "carbohydrate": entree.carbohydrate,
            "protein": entree.protein,
            "image": entree.image,
            "is_premium": entree.is_premium,
        }
        for entree in entrees
    ]

    return jsonify(entrees_list), 200


@kiosk_bp.route('/drinks', methods=['GET'])
def get_drinks():
    fountain_drinks = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'fountainDrink'}
    ).fetchall()

    fountain_drinks_list = [
        {
            "product_id": fountain_drink.product_id,
            "product_name": fountain_drink.product_name,
            "type": fountain_drink.type,
            "is_seasonal": fountain_drink.is_seasonal,
            "is_available": fountain_drink.is_available,
            "servings_remaining": fountain_drink.servings_remaining,
            "allergens": fountain_drink.allergens,
            "display_icons": fountain_drink.display_icons,
            "product_description": fountain_drink.product_description,
            "premium_addition": fountain_drink.premium_addition,
            "serving_size": fountain_drink.serving_size,
            "calories": fountain_drink.calories,
            "saturated_fat": fountain_drink.saturated_fat,
            "carbohydrate": fountain_drink.carbohydrate,
            "protein": fountain_drink.protein,
            "image": fountain_drink.image,
            "is_premium": fountain_drink.is_premium,
        }
        for fountain_drink in fountain_drinks
    ]

    drinks = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'drink'}
    ).fetchall()

    drinks_list = [
        {
            "product_id": drink.product_id,
            "product_name": drink.product_name,
            "type": drink.type,
            "is_seasonal": drink.is_seasonal,
            "is_available": drink.is_available,
            "servings_remaining": drink.servings_remaining,
            "allergens": drink.allergens,
            "display_icons": drink.display_icons,
            "product_description": drink.product_description,
            "premium_addition": drink.premium_addition,
            "serving_size": drink.serving_size,
            "calories": drink.calories,
            "saturated_fat": drink.saturated_fat,
            "carbohydrate": drink.carbohydrate,
            "protein": drink.protein,
            "image": drink.image,
            "is_premium": drink.is_premium,
        }
        for drink in drinks
    ]

    return jsonify(fountain_drinks_list + drinks_list), 200


@kiosk_bp.route('/appetizers', methods=['GET'])
def get_appetizers():
    appetizers = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'appetizer'}
    ).fetchall()

    appetizers_list = [
        {
            "product_id": appetizer.product_id,
            "product_name": appetizer.product_name,
            "type": appetizer.type,
            "is_seasonal": appetizer.is_seasonal,
            "is_available": appetizer.is_available,
            "servings_remaining": appetizer.servings_remaining,
            "allergens": appetizer.allergens,
            "display_icons": appetizer.display_icons,
            "product_description": appetizer.product_description,
            "premium_addition": appetizer.premium_addition,
            "serving_size": appetizer.serving_size,
            "calories": appetizer.calories,
            "saturated_fat": appetizer.saturated_fat,
            "carbohydrate": appetizer.carbohydrate,
            "protein": appetizer.protein,
            "image": appetizer.image,
            "is_premium": appetizer.is_premium,
        }
        for appetizer in appetizers
    ]

    return jsonify(appetizers_list), 200


@kiosk_bp.route('/desserts', methods=['GET'])
def get_desserts():
    desserts = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'dessert'}
    ).fetchall()

    desserts_list = [
        {
            "product_id": dessert.product_id,
            "product_name": dessert.product_name,
            "type": dessert.type,
            "is_seasonal": dessert.is_seasonal,
            "is_available": dessert.is_available,
            "servings_remaining": dessert.servings_remaining,
            "allergens": dessert.allergens,
            "display_icons": dessert.display_icons,
            "product_description": dessert.product_description,
            "premium_addition": dessert.premium_addition,
            "serving_size": dessert.serving_size,
            "calories": dessert.calories,
            "saturated_fat": dessert.saturated_fat,
            "carbohydrate": dessert.carbohydrate,
            "protein": dessert.protein,
            "image": dessert.image,
            "is_premium": dessert.is_premium,
        }
        for dessert in desserts
    ]

    return jsonify(desserts_list), 200


@kiosk_bp.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    total_price = data.get('total_price')
    cart_items = data.get('cart_items')

    if not cart_items or not total_price:
        return jsonify({'error': 'Invalid order data'}), 400

    try:
        # Start a transaction
        with db.session.begin_nested():
            # Create the Order
            order = Order(
                order_date_time=datetime.now(timezone.utc),
                total_price=total_price,
                employee_id=None
                # You can include employee_id if applicable
            )
            db.session.add(order)
            db.session.flush()  # To get the order_id

            # For each cart item, create OrderMenuItem and OrderMenuItemProduct
            for cart_item in cart_items:
                name = cart_item.get('name')
                quantity = cart_item.get('quantity', 1)
                base_price = cart_item.get('basePrice')
                premium_multiplier = cart_item.get('premiumMultiplier')
                components = cart_item.get('components')

                # Get the MenuItem by name
                menu_item = MenuItem.query.filter_by(item_name=name).first()
                if not menu_item:
                    return jsonify({'error': f'Menu item "{name}" not found'}), 400

                # Calculate subtotal_price for this cart item
                subtotal_price = get_item_price(cart_item)

                # Create OrderMenuItem entries based on quantity
                for _ in range(quantity):
                    order_menu_item = OrderMenuItem(
                        order_id=order.order_id,
                        menu_item_id=menu_item.menu_item_id,
                        subtotal_price=subtotal_price / quantity
                    )
                    db.session.add(order_menu_item)
                    db.session.flush()  # To get the order_menu_item_id

                    # Add OrderMenuItemProduct entries for sides and entrees
                    # Sides
                    for side in components.get('sides', []):
                        product_id = side.get('product_id')
                        if not product_id:
                            return jsonify({'error': 'Product ID missing in side item'}), 400
                        # Verify that the product exists
                        product = ProductItem.query.get(product_id)
                        if not product:
                            return jsonify({'error': f'Product with ID {product_id} not found'}), 400
                        # Create OrderMenuItemProduct
                        order_menu_item_product = OrderMenuItemProduct(
                            order_menu_item_id=order_menu_item.order_menu_item_id,
                            product_id=product_id
                        )
                        db.session.add(order_menu_item_product)
                    # Entrees
                    for entree in components.get('entrees', []):
                        product_id = entree.get('product_id')
                        if not product_id:
                            return jsonify({'error': 'Product ID missing in entree item'}), 400
                        # Verify that the product exists
                        product = ProductItem.query.get(product_id)
                        if not product:
                            return jsonify({'error': f'Product with ID {product_id} not found'}), 400
                        # Create OrderMenuItemProduct
                        order_menu_item_product = OrderMenuItemProduct(
                            order_menu_item_id=order_menu_item.order_menu_item_id,
                            product_id=product_id
                        )
                        db.session.add(order_menu_item_product)

                # Handle simple items (e.g., drinks, appetizers)
                if not components:
                    # Create OrderMenuItem entries based on quantity
                    for _ in range(quantity):
                        order_menu_item = OrderMenuItem(
                            order_id=order.order_id,
                            menu_item_id=menu_item.menu_item_id,
                            subtotal_price=subtotal_price / quantity
                        )
                        db.session.add(order_menu_item)
                        db.session.flush()

            # Commit the transaction
            db.session.commit()
        return jsonify({'message': 'Order created successfully', 'order_id': order.order_id}), 201
    except Exception as e:
        db.session.rollback()
        print('Error creating order:', e)
        return jsonify({'error': 'An error occurred while creating the order.'}), 500

def get_item_price(item):
    # Implement the pricing logic
    quantity = item.get('quantity', 1)
    if 'basePrice' in item and 'premiumMultiplier' in item and 'components' in item:
        base_price = float(item['basePrice'])
        premium_multiplier = float(item['premiumMultiplier'])
        components = item['components']
        total_premium_addition = 0.0
        # Sides
        for side in components.get('sides', []):
            if side.get('is_premium'):
                total_premium_addition += float(side.get('premium_addition', 0))
        # Entrees
        for entree in components.get('entrees', []):
            if entree.get('is_premium'):
                total_premium_addition += float(entree.get('premium_addition', 0))
        total_price = base_price + premium_multiplier * total_premium_addition
        return round(total_price * quantity, 2)
    elif 'price' in item:
        return round(float(item['price']) * quantity, 2)
    elif 'premium_addition' in item:
        return round(float(item.get('premium_addition', 0)) * quantity, 2)
    else:
        return 0.0