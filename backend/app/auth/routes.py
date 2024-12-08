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
import requests
import os

HASH_API_KEY = os.getenv('HASH_API_KEY')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')


@auth_bp.route('/', methods=['GET'])
def auth_home():
    """
    Home endpoint for the authentication blueprint.
    ---
    tags:
      - Authentication
    responses:
      200:
        description: Welcome message for the login page.
    """
    session.setdefault("name", None)
    session.setdefault("email", None)
    session.setdefault("state", "mystate")
    return {"message": "Welcome to Login Page"}


@auth_bp.route('/signup', methods=['POST'])
def handle_signup():
    """
    Sign up a new customer.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: body
        description: Customer signup details
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: customer@example.com
            password:
              type: string
              example: password123
            first_name:
              type: string
              example: John
            last_name:
              type: string
              example: Doe
    responses:
      200:
        description: Signup successful
      400:
        description: Invalid input data
    """
    data = request.get_json()

    with db.session.begin():
        max_customer_id = db.session.execute(text("SELECT COALESCE(MAX(customer_id), 0) FROM customer_info;"))
        db.session.execute(text("SELECT setval('customer_info_customer_id_seq', :next_id, FALSE);"), {'next_id': max_customer_id.scalar() + 1})  

        new_customer = Customer(email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'], beast_points=0)
        db.session.add(new_customer)
        db.session.commit()

    return jsonify({"message": "Signup data received"}), 200


@auth_bp.route('/signup/email', methods=['POST'])
def emailExists():
    """
    Check if an email is already registered.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: email
        description: Email to check
        required: true
        schema:
          type: string
          example: customer@example.com
    responses:
      200:
        description: Email exists (True/False)
    """
    customerEmail = request.get_data()
    customerEmail = customerEmail.decode('utf-8')

    #returns instance of customer model
    customer = Customer.query.filter_by(email=customerEmail).first()

    if (customer == None):
        return jsonify(True)
    else:
        return jsonify(False)


@auth_bp.route("/signin/email", methods=['POST'])
def signinEmail():
    """
    Retrieve the password for a customer's email.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: email
        description: Customer email
        required: true
        schema:
          type: string
          example: customer@example.com
    responses:
      200:
        description: Password for the email
      404:
        description: Email not found
    """
    customerEmail = request.get_data()
    customerEmail = customerEmail.decode('utf-8')

    #returns instance of customer model
    customer = Customer.query.filter_by(email=customerEmail).first()

    if customer:
        return jsonify(customer.password) #return password for given email if in database
    else:
        return jsonify(False)  #email not in database


@auth_bp.route("/signin/qr", methods=["POST"])
def authenticateLogin():
    """
    Authenticate a customer using email and password.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: login
        description: Customer login details
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: customer@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Customer authenticated
      401:
        description: Invalid credentials
    """
    customerLogin = request.get_json() #get_json returns python dictionary

    #returns instance of customer model
    queryCustomer = Customer.query.filter_by(email=customerLogin["email"]).first()

    if (queryCustomer == None):
        return jsonify(False)
    else:
        isValidLogin = (customerLogin["password"] == queryCustomer.password)
        # isValidLogin = (customerLogin["customer_id"] == queryCustomer.customer_id)
        if (isValidLogin):
            return jsonify({"customer_id":queryCustomer.customer_id, "email":queryCustomer.email, "first_name":queryCustomer.first_name, "last_name":queryCustomer.last_name, "beast_points":queryCustomer.beast_points})
        else:
            return jsonify(False)


@auth_bp.route("/signin/customerdata", methods=["POST"])
def getCustomerData():
    """
    Retrieve customer data by email.
    ---
    tags:
      - Customer
    parameters:
      - in: body
        name: email
        description: Customer email
        required: true
        schema:
          type: string
          example: customer@example.com
    responses:
      200:
        description: Customer data retrieved successfully
      404:
        description: Customer not found
    """
    customerEmail = request.get_data()
    customerEmail = customerEmail.decode('utf-8')

    queryCustomer = Customer.query.filter_by(email=customerEmail).first()
    if (queryCustomer):
        return jsonify({"customer_id": queryCustomer.customer_id, "email": queryCustomer.email, "first_name":queryCustomer.first_name, "last_name":queryCustomer.last_name, "beast_points":queryCustomer.beast_points})
    else:
        return jsonify(False)


@auth_bp.route("/login/db", methods=["POST"])
def authenticate_db():
    """
    Authenticate an employee by email.
    ---
    tags:
      - Authentication
      - Employee
    parameters:
      - in: body
        name: username
        description: Employee email for authentication
        required: true
        schema:
          type: string
          example: employee@example.com
    responses:
      200:
        description: Employee authenticated
      404:
        description: Employee not found
    """
    data = request.get_json()
    email = data.get("username")
    with db.session.begin():
        employee = db.session.query(Employee).filter_by(email=email).first()

    if employee:
        current_app.config["name"] = employee.first_name
        current_app.config["role"] = employee.role
        current_app.config["email"] = employee.email
        if employee.role == 'manager':
            return jsonify({"success": True, "password": employee.password, "route": "/manager"})
        elif employee.role == 'fired':
            return jsonify({"success": True, "password": employee.password, "route": "/auth/error"})
        else:
            return jsonify({"success": True, "password": employee.password, "route": "/pos"})
    else:
        return jsonify({"success": False, "password": "", "route": ""})


@auth_bp.route("/signin/google", methods=["GET"])
def authenticate_google():
    """
    Authenticate a user using Google OAuth.
    ---
    tags:
      - Authentication
      - Google OAuth
    responses:
      302:
        description: Redirects to Google OAuth authorization URL
    """
    flow = current_app.config['OAUTH_FLOW']
    authorization_url, _ = flow.authorization_url(state="mystate")
    return redirect(authorization_url)


@auth_bp.route("/callback")
def callback():
    """
    Handle Google OAuth callback and retrieve user information.
    ---
    tags:
      - Authentication
      - Google OAuth
    responses:
      302:
        description: Redirects based on user role (Manager, POS, or Error)
    """
    try:
        flow = current_app.config['OAUTH_FLOW']
        flow.fetch_token(authorization_response=request.url)

        credentials = flow.credentials
        request_session = requests.session()
        cached_session = cachecontrol.CacheControl(request_session)
        token_request = google.auth.transport.requests.Request(session=cached_session)
        
        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=6000
        )

        email = id_info.get("email")

        with db.session.begin():
            employee = db.session.query(Employee).filter_by(email=email).first()

        if employee:
            if employee.role == 'manager':
                re_route_link = current_app.config['base_url'] + "/manager"
            elif employee.role == 'fired':
                re_route_link = current_app.config['base_url'] + "/auth/error"
            else:
                re_route_link = current_app.config['base_url'] + "/pos"

            current_app.config["name"] = id_info.get("name")
            current_app.config["role"] = employee.role
            current_app.config["email"] = id_info.get("email")
            return redirect(re_route_link)
        else:
            re_route_link = current_app.config['base_url'] + "/auth/error"
            session.clear()
            return redirect(re_route_link)
    except Exception as e:
        re_route_link = current_app.config['base_url'] + "/auth/signup/error"
        print(f"An error occurred: {e}")
        return redirect(re_route_link)


@auth_bp.route("/manager/permission")
def manager_perm():
    """
    Check if the current user has manager permissions.
    ---
    tags:
      - Authentication
      - Permissions
    responses:
      200:
        description: Returns authentication status for manager access
    """
    if("role" in current_app.config and current_app.config["role"] == 'cashier'):
        to_return = {"authenticate": True}
        return jsonify(to_return)
    else:
        to_return = {"authenticate": False}
        return jsonify(to_return)
 

@auth_bp.route("/login/customer", methods=["POST"])
def login():
    """
    Authenticate a customer by email and password.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: credentials
        description: Customer login credentials
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: customer@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Customer authenticated successfully
      401:
        description: Incorrect password
      404:
        description: Customer email not found
    """
    data = request.get_json()
    email = data.get("email")
    input_password = data.get("password")

    with db.session.begin():
        customer = db.session.query(Customer).filter_by(email=email).first()

    if customer:
        validation_url = f"{HASH_API_KEY}validate?plain={input_password}&hashed={customer.password}"
        response = requests.get(validation_url)
        
        if response.status_code == 200:
            validation_data = response.json()
            if validation_data.get('valid'):
                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "customer_id": customer.customer_id 
                })
            else:
                return jsonify({"success": False, "message": "Incorrect password"}), 401
        else:
            return jsonify({"success": False, "message": "Error validating password"}), 500
    else:
        return jsonify({"success": False, "message": "Email account not found"}), 404


@auth_bp.route("/signup/customer", methods=["POST"])
def sign_up():
    """
    Register a new customer with email and password.
    ---
    tags:
      - Authentication
      - Customer
    parameters:
      - in: body
        name: details
        description: Customer signup details
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
              example: customer@example.com
            password:
              type: string
              example: password123
            first_name:
              type: string
              example: John
            last_name:
              type: string
              example: Doe
    responses:
      200:
        description: Customer account created successfully
      409:
        description: Email already registered
      500:
        description: Internal server error during account creation
    """
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with db.session.begin():
        existing_customer = db.session.query(Customer).filter_by(email=email).first()
        if existing_customer:
            return jsonify({"success": False, "message": "Email already registered"}), 409

    hash_url = f"{HASH_API_KEY}hash?plain={password}"
    response = requests.get(hash_url)

    if response.status_code == 200:
        hash_data = response.json()
        hashed_password = hash_data.get('hashed')

        max_customer_id_result = db.session.execute(text("SELECT COALESCE(MAX(customer_id), 0) FROM customer_info;"))
        next_customer_id = max_customer_id_result.scalar() + 1
        db.session.execute(text("SELECT setval('customer_info_customer_id_seq', :next_id, FALSE);"), {'next_id': next_customer_id})

        new_customer = Customer(
            email=data['email'],
            password=hashed_password,
            first_name=data.get('first_name'),  
            last_name=data.get('last_name'),   
            beast_points=1000
        )

        try:
            db.session.add(new_customer)
            db.session.commit()
            return jsonify({"success": True, "message": "Account created successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "message": f"Error creating account: {str(e)}"}), 500
    else:
        return jsonify({"success": False, "message": "Error hashing password"}), 500


@auth_bp.route("/login/customer/info/<int:customer_id>", methods=["GET"])
def get_customer_info(customer_id):
    """
    Retrieve customer information by ID.
    ---
    tags:
      - Customer
    parameters:
      - in: path
        name: customer_id
        description: Customer ID
        required: true
        schema:
          type: integer
          example: 123
    responses:
      200:
        description: Customer information retrieved successfully
      404:
        description: Customer not found
      500:
        description: Internal server error
    """
    try:
        customer = db.session.query(Customer).filter_by(customer_id=customer_id).first()
        if customer:
            customer_data = {
                "customer_id": customer.customer_id,
                "email": customer.email,
                "password": customer.password,
                "first_name": customer.first_name,
                "last_name": customer.last_name,
                "beast_points": customer.beast_points,
            }
            return jsonify({"success": True, "data": customer_data}), 200
        else:
            return jsonify({"success": False, "message": "Customer not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
