from . import manager_bp

@manager_bp.route('/', methods=['GET'])
def manager_dashboard():
    return {"message": "Welcome to the Manager View"}
