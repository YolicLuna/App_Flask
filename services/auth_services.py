from flask import session

from Models import User, db


def register_user(data):
    if not isinstance(data, dict):
        return {'error': 'Se requiere un objeto JSON valido.'}, 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not all(
        isinstance(value, str) and value.strip()
        for value in (username, email, password)
    ):
        return {'error': 'username, email y password son obligatorios.'}, 400

    if User.query.filter_by(email=email).first() is not None:
        return {'error': 'El email ya esta registrado.'}, 400
    if User.query.filter_by(username=username).first() is not None:
        return {'error': 'El nombre de usuario ya esta registrado.'}, 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return {'message': f'Usuario {user.username} registrado con exito.'}, 200


def login_user(data):
    if not isinstance(data, dict):
        return {'error': 'Se requiere un objeto JSON valido.'}, 400

    email = data.get('email')
    password = data.get('password')
    if not isinstance(email, str) or not isinstance(password, str):
        return {'error': 'email y password son obligatorios.'}, 400

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return {'error': 'Credenciales invalidas'}, 401

    session['user_id'] = user.id
    return {
        'message': 'Inicio de sesion exitoso',
        'username': user.username,
        'userId': user.id
    }, 200


def logout_user():
    session.pop('user_id', None)
    return {'message': 'Sesion cerrada con exito.'}, 200


def check_auth(user_id):
    user = db.session.get(User, user_id) if user_id else None
    if user is None:
        return {'authenticated': False, 'username': ''}, 200

    return {
        'authenticated': True,
        'username': user.username,
        'userId': user.id
    }, 200
