from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .menu import menu_bp
from .kitchen import kitchen_bp
from .manager import manager_bp
from .kiosk import kiosk_bp
from .pos import pos_bp
from .auth import auth_bp
from .extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cors = CORS(app, origins='*')

    # example api get method
    @app.route("/api/users", methods=['GET'])
    def users():
        return jsonify({
            "users": [
                'Ethan',
                'Elliot',
                'Venkat',
                'Aurora',
                'Gretta',
                'Bella'
            ]
        })
    
    # Initialize the database with the app
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(menu_bp, url_prefix='/menu')
    app.register_blueprint(kitchen_bp, url_prefix='/kitchen')
    app.register_blueprint(manager_bp, url_prefix='/manager')
    app.register_blueprint(kiosk_bp, url_prefix='/kiosk')
    app.register_blueprint(pos_bp, url_prefix='/pos')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app