from . import kiosk_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

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

    return jsonify(drinks_list), 200


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