from flask import Flask, send_from_directory
from app import register_extensions, register_blueprints, register_secret_key
from app.config import Config
import os
import pathlib
from google_auth_oauthlib.flow import Flow

# Initialize the Flask app
app = Flask(__name__, static_folder='build', static_url_path='')
app.config.from_object(Config)

# Register extensions and blueprints
register_extensions(app)
register_blueprints(app)
register_secret_key(app)

#oauth setup
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
GOOGLE_CLIENT_ID = "691942944903-g8cmnfe0iu3jujav9jpgonda6dkj9b8u.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret_691942944903-g8cmnfe0iu3jujav9jpgonda6dkj9b8u.apps.googleusercontent.com.json")

flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri="https://project-3-01-beastmode-1fed971de919.herokuapp.com/api/auth/callback"
)

app.config['OAUTH_FLOW'] = flow

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
