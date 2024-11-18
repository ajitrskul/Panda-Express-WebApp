from . import menu_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

@menu_bp.route('/', methods=['GET'])
def customer_menu_home():
    return {"message": "Welcome to the Customer Menu"}

@menu_bp.route('/menu', methods=['GET'])
def get_menu_items():

    single_a_la_carte = db.session.execute(
        text("SELECT * FROM menu_item WHERE item_name = 'aLaCarteSideMedium' LIMIT 1")
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

    menu_items = all_other_items + single_a_la_carte

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

@menu_bp.route('/sides', methods=['GET'])
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

@menu_bp.route('/alacarte', methods=['GET'])
def get_a_la_carte():

    a_la_carte = db.session.execute(
        text("""SELECT * FROM menu_item 
            WHERE item_name LIKE 'aLaCarte%' 
            ORDER BY menu_item_id ASC""")
    ).fetchall()

    a_la_carte_list = [
        {
            "menu_item_id": a_la_carte_item.menu_item_id,
            "item_name": a_la_carte_item.item_name,
            "max_entrees": a_la_carte_item.max_entrees,
            "max_sides": a_la_carte_item.max_sides,
            "menu_item_base_price": a_la_carte_item.menu_item_base_price,
            "premium_multiplier": a_la_carte_item.premium_multiplier,
            "menu_item_description": a_la_carte_item.menu_item_description,
            "calories": a_la_carte_item.calories,
            "image": a_la_carte_item.image,
        }
        for a_la_carte_item in a_la_carte
    ]

    return jsonify(a_la_carte_list), 200

@menu_bp.route('/entrees', methods=['GET'])
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

@menu_bp.route('/appdessert', methods=['GET'])
def get_appetizers():
    appetizers = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'appetizer'}
    ).fetchall()

    desserts = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'dessert'}
    ).fetchall()

    both = appetizers + desserts

    appetizer_dessert_list = [
        {
            "product_id": item.product_id,
            "product_name": item.product_name,
            "type": item.type,
            "is_seasonal": item.is_seasonal,
            "is_available": item.is_available,
            "servings_remaining": item.servings_remaining,
            "allergens": item.allergens,
            "display_icons": item.display_icons,
            "product_description": item.product_description,
            "premium_addition": item.premium_addition,
            "serving_size": item.serving_size,
            "calories": item.calories,
            "saturated_fat": item.saturated_fat,
            "carbohydrate": item.carbohydrate,
            "protein": item.protein,
            "image": item.image,
            "is_premium": item.is_premium,
        }
        for item in both
    ]

    return jsonify(appetizer_dessert_list), 200

@menu_bp.route('/drink', methods=['GET'])
def get_drinks():
    drinks = db.session.execute(
        text("SELECT * FROM product_item WHERE type = :type ORDER BY product_id ASC"), 
        {'type': 'drink'}
    ).fetchall()

    drink_list = [
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

    return jsonify(drink_list), 200

@menu_bp.route('/allitems', methods=['GET'])
def get_all_items():
    all_items = db.session.execute(
        text("SELECT * FROM menu_item")
    ).fetchall()

    items_list = [
        {
            "menu_item_id": item.menu_item_id,
            "item_name": item.item_name,
            "max_entrees": item.max_entrees,
            "max_sides": item.max_sides,
            "menu_item_base_price": item.menu_item_base_price,
            "premium_multiplier": item.premium_multiplier,
            "menu_item_description": item.menu_item_description,
            "calories": item.calories,
            "image": item.image,
        }
        for item in all_items
    ]

    return jsonify(items_list), 200