from flask import Blueprint, current_app, request, jsonify, session
from Models import Article, User, db
from services.article_services import get_articles, delete_article, update_article, create_article, get_articles, get_favorites, toggle_favorite
from sqlalchemy.exc import SQLAlchemyError

bp = Blueprint('articles', __name__)

def serialize_article(article, is_favorite=False):
    return {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'image_url': article.image_url,
        'author': article.author.username,
        'userId': article.user_id,
        'created_at': article.created_at.strftime('%d-%m-%Y'),
        'isFavorite': is_favorite
    }


@bp.route('/favorites/<int:article_id>', methods=['POST'])
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

@bp.route('/favorites', methods=['GET'])
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
@bp.route('/articles', methods = ['GET'])
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
@bp.route('/create-article', methods = ['POST'])
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
@bp.route('/articles/<int:id>', methods=['PUT'])
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
@bp.route('/articles/<int:id>', methods=['DELETE'])
def delete_article(id):
    if 'user_id' not in session:
        return jsonify({'message': 'No autorizado'}), 401

    article = Article.query.get_or_404(id)

    if article.user_id != session['user_id']:
        return jsonify({'message': 'No autorizado para eliminar este articulo'}), 403

    title = article.title
    try:
        db.session.delete(article)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception('Error al eliminar el articulo %s', id)
        return jsonify({'message': 'Error al eliminar el articulo'}), 500

    return jsonify({'message': f'Articulo eliminado con exito. Se elimino {title}'}), 200

# Obtenemos un articulo.
@bp.route('/article/<int:article_id>', methods=['GET'])
def view_article(article_id):
    article = Article.query.get_or_404(article_id)
    return jsonify({
        'id': article.id,
        'title': article.title,
        'content': article.content
    })
