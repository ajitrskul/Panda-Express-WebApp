from . import kitchen_bp

@kitchen_bp.route('/', methods=['GET'])
def kitchen_display():
    return {"message": "Welcome to the Kitchen View"}
