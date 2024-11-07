from .extensions import db

class ProductItem(db.Model):
    __tablename__ = 'product_item'

    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    is_seasonal = db.Column(db.Boolean, nullable=False)
    is_available = db.Column(db.Boolean, nullable=False)
    servings_remaining = db.Column(db.Float, nullable=False)
    allergens = db.Column(db.String(200), nullable=False)
    display_icons = db.Column(db.Integer, nullable=False)
    product_description = db.Column(db.String(300), nullable=False)
    premium_addition = db.Column(db.Float, nullable=False)
    serving_size = db.Column(db.Float, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    saturated_fat = db.Column(db.Integer, nullable=False)
    carbohydrate = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable=True)
    is_premium = db.Column(db.Boolean, nullable=False)
    quantity_in_cases = db.Column(db.Integer, nullable=False)
    servings_per_case = db.Column(db.Integer, nullable=False)
    cost_per_case = db.Column(db.Integer, nullable=False)

class MenuItem(db.Model):
    __tablename__ = 'menu_item'

    menu_item_id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(50), nullable=False)
    max_entrees = db.Column(db.Integer, nullable=False)
    max_sides = db.Column(db.Integer, nullable=False)
    menu_item_base_price = db.Column(db.Float, nullable=False)
    premium_multiplier = db.Column(db.Integer, nullable=False)
    menu_item_description = db.Column(db.String(300), nullable=False)
    calories = db.Column(db.String(30), nullable=False)
    image = db.Column(db.String(200), nullable=True)

class User(db.Model):
    __tablename__ = 'user_info'
    
    user_id = db.Column(db.Integer, primary_key=True)
    points = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)
