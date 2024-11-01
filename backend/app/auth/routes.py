from . import auth_bp
from flask import request, jsonify
from app.extensions import db
from app.models import User

@auth_bp.route('/', methods=['GET'])
def auth_home():
    return {"message": "Welcome to Login Page"}


@auth_bp.route('/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()

    #user_id auto incremented
    new_user = User(points=0, email=data['email'], password=data['password'], first_name=data['first_name'], last_name=data['last_name'], role='customer')

    with db.session.begin():
        db.session.add(new_user)
        db.session.commit()

    return jsonify({"message": "Signup data received"}), 200

@auth_bp.route('/signup/email', methods=['POST'])
def emailExists():
    userEmail = request.get_data()
    userEmail = userEmail.decode('utf-8')

    with db.session.begin():
        matchingEmail = db.session.query(User).filter_by(email=userEmail).first()

    if (matchingEmail == None):
        return jsonify(True)
    else:
        return jsonify(False)




