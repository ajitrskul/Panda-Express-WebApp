from . import auth_bp
from flask import request, jsonify, session, abort, redirect
from sqlalchemy import text
from app.extensions import db
from app.models import Customer
from app.models import Employee
import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
from flask import current_app

GOOGLE_CLIENT_ID = "691942944903-g8cmnfe0iu3jujav9jpgonda6dkj9b8u.apps.googleusercontent.com"

@auth_bp.route('/', methods=['GET'])
def auth_home():
    session.setdefault("name", None)
    session.setdefault("email", None)
    session.setdefault("state", None)
    return {"message": "Welcome to Login Page"}


@auth_bp.route('/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()

    with db.session.begin():
        max_user_id = db.session.execute(text("SELECT COALESCE(MAX(user_id), 0) FROM user_info;"))
        db.session.execute(text("SELECT setval('user_info_user_id_seq', :next_id, FALSE);"), {'next_id': max_user_id.scalar() + 1})  

        new_user = Customer(points=0, email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'], role='customer')
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Signup data received"}), 200


@auth_bp.route('/signup/email', methods=['POST'])
def emailExists():
    userEmail = request.get_data()
    userEmail = userEmail.decode('utf-8')

    with db.session.begin():
        matchingEmail = db.session.query(Customer).filter_by(email=userEmail).first()

    if (matchingEmail == None):
        return jsonify(True)
    else:
        return jsonify(False)


@auth_bp.route("/login/db", methods=["POST"])
def authenticate_db():
    data = request.get_json()
    email = data.get("username")
    with db.session.begin():
        employee = db.session.query(Employee).filter_by(email=email).first()

    if employee:
        if employee.role == 'manager':
            return jsonify({"success": True, "password": employee.password, "route": "/manager"})
        else:
            return jsonify({"success": True, "password": employee.password, "route": "/pos"})
    else:
        return jsonify({"success": False, "password": "", "route": ""})


@auth_bp.route("/signin/google", methods=["GET"])
def authenticate_google():
    flow = current_app.config['OAUTH_FLOW']
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)


@auth_bp.route("/callback")
def callback():
    try:
        flow = current_app.config['OAUTH_FLOW']
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
        email = id_info.get("email")


        with db.session.begin():
            employee = db.session.query(Employee).filter_by(email=email).first()

        if employee:
            if employee.role == 'manager':
                re_route_link = current_app.config['base_url'] + "/manager"
            else:
                re_route_link = current_app.config['base_url'] + "/pos"
            return redirect(re_route_link)
        else:
            re_route_link = current_app.config['base_url'] + "/auth/signin/error"
            return redirect(re_route_link)
    except:
        re_route_link = current_app.config['base_url'] + "/auth/signup/error"
        return redirect(re_route_link)
