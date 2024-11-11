from . import mobile_bp
from flask import request, jsonify, session, abort, redirect
from sqlalchemy import text
from app.extensions import db
from app.models import User
import os
import pathlib
import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
GOOGLE_CLIENT_ID = "691942944903-g8cmnfe0iu3jujav9jpgonda6dkj9b8u.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret_691942944903-g8cmnfe0iu3jujav9jpgonda6dkj9b8u.apps.googleusercontent.com.json")

flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri="http://127.0.0.1:5001/api/auth/callback"
)

@mobile_bp.route('/', methods=['GET'])
def mobile_home():
    return {"message": "Welcome to Login Page"}


@mobile_bp.route('/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()

    with db.session.begin():
        max_user_id = db.session.execute(text("SELECT COALESCE(MAX(user_id), 0) FROM user_info;"))
        db.session.execute(text("SELECT setval('user_info_user_id_seq', :next_id, FALSE);"), {'next_id': max_user_id.scalar() + 1})  

        new_user = User(points=0, email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'], role='customer')
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Signup data received"}), 200

@mobile_bp.route('/signup/email', methods=['POST'])
def emailExists():
    userEmail = request.get_data()
    userEmail = userEmail.decode('utf-8')

    with db.session.begin():
        matchingEmail = db.session.query(User).filter_by(email=userEmail).first()

    if (matchingEmail == None):
        return jsonify(True)
    else:
        return jsonify(False)
    
@mobile_bp.route("/signin/google", methods=["GET"])
def authenticate_google():
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)

@mobile_bp.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)
    
    if not session.get("state") == request.args.get("state"):
        abort(500)

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")

    return redirect(f"http://localhost:3000/manager")