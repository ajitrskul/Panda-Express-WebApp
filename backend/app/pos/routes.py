from . import pos_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db
from datetime import datetime
import pytz

@pos_bp.route('/', methods=['GET'])
def cashier_home():
    """
    Welcome message for the Cashier POS.
    ---
    tags:
      - POS
    responses:
      200:
        description: Welcome message for the Cashier POS.
    """
    return {"message": "Welcome to the Cashier POS"}


@pos_bp.route('/menu', methods=['GET'])
def get_menu_items():
    """
    Retrieve all menu items including specific appetizer, a la carte, and drink items.
    ---
    tags:
      - POS
      - Menu
    responses:
      200:
        description: List of menu items retrieved successfully.
    """
    single_appetizer = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'appetizerSmall' LIMIT 1")
    ).fetchall()

    single_a_la_carte = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'aLaCarteSideMedium' LIMIT 1")
    ).fetchall()

    single_drink = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'drink' LIMIT 1")
    ).fetchall()

    all_other_items = db.session.execute(
        text("""
            SELECT * FROM menu_item 
            WHERE item_name NOT LIKE 'appetizer%' 
            AND item_name NOT LIKE 'dessert%' 
            AND item_name NOT LIKE 'aLaCarte%'
            AND item_name NOT LIKE 'drink%'
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


@pos_bp.route('/sides', methods=['GET'])
def get_sides():
    """
    Retrieve all side items.
    ---
    tags:
      - POS
      - Sides
    responses:
      200:
        description: List of side items retrieved successfully.
    """
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


@pos_bp.route('/entrees', methods=['GET'])
def get_entrees():
    """
    Retrieve all entree items.
    ---
    tags:
      - POS
      - Entrees
    responses:
      200:
        description: List of entree items retrieved successfully.
    """
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


@pos_bp.route('/alacarte', methods=['GET'])
def get_a_la_carte():
    """
    Retrieve all a la carte items, including entrees and sides.
    ---
    tags:
      - POS
      - A La Carte
    responses:
      200:
        description: List of a la carte items retrieved successfully.
    """
    products = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type1 OR type = :type2 ORDER BY product_id ASC"), 
        {'type1': 'entree', 'type2': 'side'}
    ).fetchall()

    products_list = [
        {
            "product_id": product.product_id,
            "product_name": product.product_name,
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
        }
        for product in products
    ]

    return jsonify(products_list), 200


@pos_bp.route('/appetizer', methods=['GET'])
def get_appetizers():
    """
    Retrieve all appetizer and dessert items.
    ---
    tags:
      - POS
      - Appetizers
      - Desserts
    responses:
      200:
        description: List of appetizers and desserts retrieved successfully.
    """
    products = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type1 OR type = :type2 ORDER BY product_id ASC"), 
        {'type1': 'appetizer', 'type2': 'dessert'}
    ).fetchall()

    products_list = [
        {
            "product_id": product.product_id,
            "product_name": product.product_name,
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
        }
        for product in products
    ]

    return jsonify(products_list), 200


@pos_bp.route('/drink', methods=['GET'])
def get_drinks():
    """
    Retrieve all drink items.
    ---
    tags:
      - POS
      - Drinks
    responses:
      200:
        description: List of drinks retrieved successfully.
    """
    drinks = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type1 OR type = :type2 ORDER BY product_id ASC"), 
        {'type1': 'drink', 'type2': 'fountainDrink'}
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

    return jsonify(drinks_list), 200


@pos_bp.route('/size/<string:item_name>/<string:size>', methods=['GET'])
def get_size_price(item_name, size):
    """
    Retrieve the price for a specific menu item size.
    ---
    tags:
      - POS
      - Pricing
    parameters:
      - in: path
        name: item_name
        required: true
        schema:
          type: string
        description: Name of the menu item.
      - in: path
        name: size
        required: true
        schema:
          type: string
        description: Size of the menu item (e.g., small, medium, large).
    responses:
      200:
        description: Item size price retrieved successfully.
      400:
        description: Invalid size specified.
      404:
        description: Size not found.
    """
    size_mapping = {
        "small": "Small",
        "medium": "Medium",
        "large": "Large"
    }

    size_name = size_mapping.get(size.lower(), None)
    if not size_name:
        return jsonify({"error": "Invalid size"}), 400

    result = db.session.execute(
        text("""
            SELECT 
             item_name, 
             menu_item_base_price, 
             premium_multiplier
            FROM menu_item 
            WHERE item_name = :item_name || :size_name
        """),
        {"item_name": item_name, "size_name": size_name}
    ).fetchone()

    if not result:
        return jsonify({"error": "Size not found"}), 404

    return jsonify({
                    "name": result.item_name, 
                    "price": float(result.menu_item_base_price), 
                    "multiplier": float(result.premium_multiplier)
                }), 200


@pos_bp.route('/checkout', methods=['POST'])
def checkout():
    """
    Visualize a checkout order.
    ---
    tags:
      - POS
      - Checkout
    parameters:
      - in: body
        name: order
        required: true
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                type: object
            total:
              type: number
              format: float
    responses:
      200:
        description: Order data received successfully.
      500:
        description: Failed to process the order.
    """
    try:
        data = request.get_json()
        print("Received Order Data:", data)

        items = data.get("items", [])
        total_price = data.get("total", 0)
        print(f"\nTotal Price: ${total_price}")

        for idx, item in enumerate(items):
            print(f"\nItem {idx + 1}:")
            print(f" - Name: {item['name']}")
            print(f" - Quantity: {item['quantity']}")
            print(f" - Price: ${item['price']}")

            subitems = item.get('subitems', [])
            for sub_idx, subitem in enumerate(subitems):
                print(f"   Subitem {sub_idx + 1}:")
                print(f"    - Name: {subitem['product_name']}")
                print(f"    - Type: {subitem['type']}")
                print(f"    - Quantity: {subitem['quantity']}")

        return jsonify({"message": "Order received and printed successfully"}), 200

    except Exception as e:
        print(f"Error while processing checkout: {e}")
        return jsonify({"error": "Failed to process the order"}), 500


@pos_bp.route('/checkout/confirm', methods=['POST'])
def confirm_checkout():
    """
    Confirm a checkout order and save to the database.
    ---
    tags:
      - POS
      - Checkout
    parameters:
      - in: body
        name: order
        required: true
        schema:
          type: object
          properties:
            items:
              type: array
              items:
                type: object
            total:
              type: number
              format: float
            customer_id:
              type: integer
            beast_points:
              type: integer
    responses:
      201:
        description: Order confirmed and saved successfully.
      404:
        description: Menu item not found.
      500:
        description: Failed to confirm the order.
    """
    try:
        order_data = request.get_json()
        order_items = order_data.get("items", [])
        total_price = order_data.get("total", 0.0)
        customer_id = order_data.get("customer_id", None)
        beast_points_used = order_data.get("beast_points_used", 0)
        order_date_time = datetime.now(pytz.timezone('America/Chicago')).strftime('%Y-%m-%d %H:%M:%S')
        employee_id = 121202  # CHANGE LATER

        # Order Table
        insert_order_query = text("""
            INSERT INTO public."order" (order_date_time, employee_id, total_price, is_ready)
            VALUES (:order_date_time, :employee_id, :total_price, :is_ready)
            RETURNING order_id
        """)
        order_result = db.session.execute(
            insert_order_query,
            {
                "order_date_time": order_date_time,
                "employee_id": employee_id,
                "total_price": total_price,
                "is_ready": False  
            }
        )
        db.session.commit()
        order_id = order_result.fetchone().order_id

        # order
        for item_idx, item in enumerate(order_items):
            item_name = item.get("name")
            item_price = item.get("price")
            quantity = item.get("quantity", 1)
            
            # Get the menu item ID
            menu_item_query = text("SELECT menu_item_id FROM menu_item WHERE item_name = :item_name")
            menu_item_result = db.session.execute(menu_item_query, {"item_name": item_name}).fetchone()

            if not menu_item_result:
                return jsonify({"error": f"Menu item '{item_name}' not found"}), 404
            
            menu_item_id = menu_item_result.menu_item_id

            # order_menu_item
            for _ in range(quantity):
                insert_order_menu_item_query = text("""
                    INSERT INTO public.order_menu_item (order_id, menu_item_id, subtotal_price)
                    VALUES (:order_id, :menu_item_id, :subtotal_price)
                    RETURNING order_menu_item_id
                """)
                order_menu_item_result = db.session.execute(
                    insert_order_menu_item_query,
                    {
                        "order_id": order_id,
                        "menu_item_id": menu_item_id,
                        "subtotal_price": item_price
                    }
                )
                db.session.commit()
                order_menu_item_id = order_menu_item_result.fetchone().order_menu_item_id

                # order_menu_item_product
                subitems = item.get("subitems", [])
                for subitem in subitems:
                    product_id = subitem.get("product_id")
                    quantity = subitem.get("quantity", 1)
                    
                    insert_order_menu_item_product_query = text("""
                        INSERT INTO public.order_menu_item_product (order_menu_item_id, product_id)
                        VALUES (:order_menu_item_id, :product_id)
                    """)
                    db.session.execute(
                        insert_order_menu_item_product_query,
                        {
                            "order_menu_item_id": order_menu_item_id,
                            "product_id": product_id
                        }
                    )

                    # Update servings remaining in the product_item table
                    update_servings_query = text("""
                        UPDATE public.product_item
                        SET servings_remaining = servings_remaining - :quantity
                        WHERE product_id = :product_id
                    """)
                    db.session.execute(
                        update_servings_query,
                        {
                            "quantity": quantity,
                            "product_id": product_id
                        }
                    )

        if customer_id:
            update_beast_points_query = text("""
                UPDATE public.customer_info
                SET beast_points = beast_points - :beast_points_used
                WHERE customer_id = :customer_id
            """)
            db.session.execute(
                update_beast_points_query,
                {
                    "beast_points_used": beast_points_used,
                    "customer_id": customer_id
                }
            )

        db.session.commit()
        return jsonify({"message": "Successfully confirmed", "order_id": order_id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Confirm order failed: {e}")
        return jsonify({"error": "Failed to confirm the order"}), 500
    

@pos_bp.route('/next-order-id', methods=['GET'])
def get_next_order_id():
    """
    Retrieve the next available order ID.
    ---
    tags:
      - POS
      - Orders
    responses:
      200:
        description: Next order ID retrieved successfully.
      500:
        description: Failed to retrieve the next order ID.
    """
    try:
        next_order_id_query = text("""
            SELECT MAX(order_id) + 1 AS next_order_id
            FROM public."order"
        """)
        result = db.session.execute(next_order_id_query).fetchone()

        next_order_id = result.next_order_id if result.next_order_id is not None else 1
        return jsonify({"next_order_id": next_order_id}), 200

    except Exception as e:
        print(f"Failed to get next order ID: {e}")
        return jsonify({"error": "Failed to get next order ID"}), 500
