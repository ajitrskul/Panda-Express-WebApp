from flask import Flask, send_from_directory
from app import register_extensions, register_blueprints
from app.config import Config

# Initialize the Flask app
app = Flask(__name__, static_folder='build', static_url_path='')
app.config.from_object(Config)

# Register extensions and blueprints
register_extensions(app)
register_blueprints(app)

# Serve React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Handle unmatched routes with React app
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
