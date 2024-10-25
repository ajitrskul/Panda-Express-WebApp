from . import auth_bp

@auth_bp.route('/', methods=['GET'])
def auth_home():
    return {"message": "Welcome to Login Page"}

