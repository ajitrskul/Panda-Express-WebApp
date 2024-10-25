from . import kiosk_bp

@kiosk_bp.route('/', methods=['GET'])
def customer_kiosk_home():
    return {"message": "Welcome to the Customer Kiosk"}
