from flask import Flask, request, jsonify, session
from Models.article import Article
from Models.user import User
from Models import db
from flask_cors import CORS

app = Flask(__name__)

CORS(app, 
supports_credentials=True, 
origins=['http://localhost:3000'],
allow_headers=['Content-Type'],
expose_headers=['Set-Cookie'],
methods=['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE']
)

app.secret_key = 'Moon159'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Ruta inicial.
@app.route('/')
def home():
    return 'Hola, mundo'

@app.route('/register', methods = ['POST'])
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

@app.route('/login', methods = ['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({'message': 'Inicio de sesion exitoso'}), 201
    else:
        return jsonify({'error': 'Credenciales invalidas'}), 401 

@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({'authenticated': True}), 200
    else:
        return jsonify({'authenticated': False}), 200

@app.route('/logout', methods=['POST'])
def logout_user():
    session.pop('user_id', None)
    return jsonify({'message': 'Sesion cerrada con exito.'})

def serialize_article(article, is_favorite=False):
    return {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'image_url': article.image_url,
        'author': article.author.username,
        'created_at': article.created_at.strftime('%d-%m-%Y'),
        'isFavorite': is_favorite
    }

@app.route('/favorites/<int:article_id>', methods=['POST'])
def toggle_favorite(article_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Debes iniciar sesion para guardar favoritos.'}), 401

    data = request.get_json(silent=True) or {}
    is_favorite = data.get('isFavorite')
    if not isinstance(is_favorite, bool):
        return jsonify({'error': 'isFavorite debe ser true o false.'}), 400

    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'La sesion no corresponde a un usuario valido.'}), 401

    article = Article.query.get_or_404(article_id)
    if is_favorite and article not in user.favorite_articles:
        user.favorite_articles.append(article)
    elif not is_favorite and article in user.favorite_articles:
        user.favorite_articles.remove(article)

    db.session.commit()
    return jsonify({
        'message': 'Favorito actualizado.',
        'isFavorite': is_favorite
    }), 200

@app.route('/favorites', methods=['GET'])
def get_favorites():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Debes iniciar sesion para ver tus favoritos.'}), 401
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'La sesion no corresponde a un usuario valido.'}), 401
    return jsonify([
        serialize_article(article, is_favorite=True)
        for article in user.favorite_articles
    ]), 200
    
# Se obtienen todos los articulos.
@app.route('/articles', methods = ['GET'])
def get_articles():
    articles = Article.query.all()
    user_id = session.get('user_id')
    user = db.session.get(User, user_id) if user_id else None
    favorite_ids = {article.id for article in user.favorite_articles} if user else set()
    return jsonify([
        serialize_article(article, article.id in favorite_ids)
        for article in articles
    ])

# Se crean articulos.
@app.route('/create-article', methods = ['POST'])
def create_article():
    data = request.get_json()
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'el usuario no esta autenticado o el ID de usuario no esta en la sesion'}), 401
    new_article = Article(
        title=data['title'], 
        content=data['content'],
        image_url=data['image_url'],
        user_id=user_id
        )
    db.session.add(new_article)
    db.session.commit()

    return jsonify(serialize_article(new_article)), 201

# Se actualizan articulos.
@app.route('/articles/<int:id>', methods=['PUT'])
def update_article(id):
    article = Article.query.get_or_404(id)
    data = request.get_json()
    article.title = data['title']
    article.content = data['content']
    db.session.commit()

    return jsonify({
        'id': article.id,
        'title': article.title,
        'content': article.content
    })

# Se eliminan articulos.  
@app.route('/articles/<int:id>', methods=['DELETE'])
def delete_article(id):
    article = Article.query.get_or_404(id)
    db.session.delete(article)
    db.session.commit()
    return jsonify({
        'message': f'El articulo "{article.title}" se a eliminado con exito. '
    }), 200

# Obtenemos un articulo.
@app.route('/article/<int:article_id>', methods=['GET'])
def view_article(article_id):
    article = Article.query.get_or_404(article_id)
    return jsonify({
        'id': article.id,
        'title': article.title,
        'content': article.content
    })



if __name__ == '__main__':
    app.run(debug=True)