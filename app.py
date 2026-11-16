import os
import secrets

from flask import Flask
from Models import db
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app_environment = os.environ.get('APP_ENV', 'development').lower()
    secret_key = os.environ.get('FLASK_SECRET_KEY')
    if not secret_key:
        if app_environment == 'production':
            raise RuntimeError('FLASK_SECRET_KEY debe configurarse en produccion.')
        secret_key = secrets.token_hex(32)
        app.logger.warning(
            'FLASK_SECRET_KEY no esta configurada; se usara una clave temporal de desarrollo.'
        )

    app.config['SECRET_KEY'] = secret_key
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        os.environ.get('DATABASE_URL') or 'sqlite:///blog.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
    CORS(app, 
        supports_credentials=True, 
        origins=[origin.strip() for origin in cors_origins.split(',') if origin.strip()],
        allow_headers=['Content-Type'],
        expose_headers=['Set-Cookie'],
        methods=['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE']
        )

    with app.app_context():
        db.create_all()

    from routes import auth_routes, article_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(article_routes.bp)

    return app