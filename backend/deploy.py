from flask import Flask, jsonify, request, send_from_directory
from app import register_extensions, register_blueprints, register_secret_key
from app.config import Config
import os
from google_auth_oauthlib.flow import Flow
import json
from dotenv import load_dotenv
import tempfile
from flask_swagger_ui import get_swaggerui_blueprint
import inspect

# Initialize the Flask app
app = Flask(__name__, static_folder='build', static_url_path='')
app.config.from_object(Config)

# Register extensions and blueprints
register_extensions(app)
register_blueprints(app)
register_secret_key(app)

#oauth setup
load_dotenv()
GOOGLE_CONFIG = json.loads(os.environ.get('GOOGLE_CONFIG'))
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

with tempfile.NamedTemporaryFile('w', delete=False) as temp_file:
    json.dump(GOOGLE_CONFIG, temp_file)
    temp_file_path = temp_file.name

flow = Flow.from_client_secrets_file(
        client_secrets_file=temp_file_path,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri="https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/auth/callback"
)

app.config['OAUTH_FLOW'] = flow
app.config['base_url'] = "https://project-3-01-beastmode-1fed971de919.herokuapp.com"
app.config["name"] = None
app.config["role"] = None
app.config["email"] = None

@app.route('/swagger.json')
def swagger_json():
    paths = {}
    tags = set()

    for rule in app.url_map.iter_rules():
        if rule.endpoint == 'static': 
            continue

        methods = list(rule.methods - {'HEAD', 'OPTIONS'})
        for method in methods:
            view_func = app.view_functions[rule.endpoint]
            doc = inspect.getdoc(view_func) or "No description provided."

            lines = doc.split("\n")
            tag = "Default"
            if lines and lines[0].startswith("tags:"):
                tag = lines[0].replace("tags:", "").strip()
                tags.add(tag)

            if rule.rule not in paths:
                paths[rule.rule] = {}
            paths[rule.rule][method.lower()] = {
                "summary": f"{method} {rule.rule}",
                "description": "\n".join(lines[1:]).strip() if len(lines) > 1 else doc,
                "tags": [tag],
                "responses": {
                    "200": {"description": "Successful response"}
                }
            }

    sorted_tags = sorted(tags)
    tags_section = [{"name": tag, "description": f"Endpoints related to {tag}"} for tag in sorted_tags]

    swagger_doc = {
        "swagger": "2.0",
        "info": {
            "title": "Flask App API",
            "description": "Auto-generated API documentation",
            "version": "1.0.0",
        },
        "host": "project-3-01-beastmode-1fed971de919.herokuapp.com",
        "schemes": ["https"],
        "tags": tags_section, 
        "paths": paths,
    }
    return jsonify(swagger_doc)

SWAGGER_URL = '/swagger'
API_URL = '/swagger.json'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Flask App API"
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Serve React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Handle unmatched routes (excluding Swagger UI)
@app.errorhandler(404)
def not_found(e):
    if request.path.startswith(SWAGGER_URL):
        return jsonify({"error": "Swagger UI resource not found"}), 404
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
