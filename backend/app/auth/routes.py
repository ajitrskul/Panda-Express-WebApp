from . import auth_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db
from app.models import Customer

@auth_bp.route('/', methods=['GET'])
def auth_home():
    return {"message": "Welcome to Login Page"}


@auth_bp.route('/signup', methods=['POST'])
def handle_signup():
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
    customerEmail = request.get_data()
    customerEmail = customerEmail.decode('utf-8')

    with db.session.begin():
        matchingEmail = db.session.query(Customer).filter_by(email=customerEmail).first()

    if (matchingEmail == None):
        return jsonify(True)
    else:
        return jsonify(False)





