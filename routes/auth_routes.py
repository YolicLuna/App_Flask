from flask import Blueprint, request, jsonify, session
from Models import User, db
from services.auth_services import register_user, login_user, logout_user, check_auth

bp = Blueprint('auth', __name__)

@bp.route('/register', methods = ['POST'])
def register_user():
    data = request.get_json()
    if User.query.filter_by(email = data ['email']).first() is not None:
        return jsonify({
            'error': 'El email ya esta reistrado.'
        }), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        'message': f'Usuario {new_user.username} registrado con exito.'
    }), 200


@bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({
            'message': 'Inicio de sesion exitoso',
            'username': user.username,
            'userId': user.id
        }), 200
    return jsonify({'error': 'Credenciales invalidas'}), 401 


@bp.route('/logout', methods=['POST'])
def logout_user():
    session.pop('user_id', None)
    return jsonify({'message': 'Sesion cerrada con exito.'})


@bp.route('/check-auth', methods=['GET'])
def check_auth():
    user_id = session.get('user_id')
    if user_id:
        user = db.session.get(User, user_id)
        if user:
            return jsonify({
                'authenticated': True,
                'username': user.username,
                'userId': user_id
            }), 200
    return jsonify({'authenticated': False, 'username': ''}), 200
