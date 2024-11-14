from . import manager_bp
from flask import request, jsonify
from sqlalchemy import text
from app.extensions import db

@manager_bp.route('/', methods=['GET'])
def manager_dashboard():
    return {"message": "Welcome to the Manager View"}

@manager_bp.route('/xreports', methods=['GET'])
def xreports_data():
    #currDate= db.session.execute(
    #text("""SELECT order_date_time FROM "order" WHERE order_id = (SELECT max(order_id) FROM "order");""")
    #).fetchall()
    #currDay=str(currDate[0][0])[5:10] + "-" + str(currDate[0][0])[0:4]
    return {"message" : "hello"}
