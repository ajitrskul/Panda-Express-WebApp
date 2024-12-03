from . import pos_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

@pos_bp.route('/', methods=['GET'])
def cashier_home():
    return {"message": "Welcome to the Cashier POS"}

@pos_bp.route('/menu', methods=['GET'])
def get_menu_items():
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


@pos_bp.route('/a-la-carte', methods=['GET'])
def get_a_la_carte():
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


@pos_bp.route('/apps-and-more', methods=['GET'])
def get_appetizers():
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


@pos_bp.route('/drinks', methods=['GET'])
def get_drinks():
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