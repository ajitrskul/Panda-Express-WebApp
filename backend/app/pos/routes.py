from . import pos_bp

@pos_bp.route('/', methods=['GET'])
def cashier_home():
    return {"message": "Welcome to the Cashier POS"}
