from . import menu_bp

@menu_bp.route('/', methods=['GET'])
def show_menu():
    return {"message": "Welcome to the Menu Board"}