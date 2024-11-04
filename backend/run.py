from flask import Flask
from app import register_extensions, register_blueprints
from app.config import Config

# Initialize the Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Register extensions and blueprints
register_extensions(app)
register_blueprints(app)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
