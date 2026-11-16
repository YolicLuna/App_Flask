from Models import Article, User, db


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


def get_articles(user_id=None):
    user = db.session.get(User, user_id) if user_id else None
    favorite_ids = {article.id for article in user.favorite_articles} if user else set()
    return [
        serialize_article(article, article.id in favorite_ids)
        for article in Article.query.all()
    ]


def create_article(data, user_id):
    if not user_id:
        return {'error': 'El usuario no esta autenticado.'}, 401
    if not isinstance(data, dict):
        return {'error': 'Se requiere un objeto JSON valido.'}, 400

    title = data.get('title')
    content = data.get('content')
    if (
        not isinstance(title, str)
        or not title.strip()
        or not isinstance(content, str)
        or not content.strip()
    ):
        return {'error': 'title y content son obligatorios.'}, 400

    if db.session.get(User, user_id) is None:
        return {'error': 'La sesion no corresponde a un usuario valido.'}, 401

    article = Article(
        title=title,
        content=content,
        image_url=data.get('image_url'),
        user_id=user_id
    )
    db.session.add(article)
    db.session.commit()
    return serialize_article(article), 201


def update_article(article_id, data):
    if not isinstance(data, dict):
        return {'error': 'Se requiere un objeto JSON valido.'}, 400

    title = data.get('title')
    content = data.get('content')
    if not isinstance(title, str) or not isinstance(content, str):
        return {'error': 'title y content son obligatorios.'}, 400

    article = db.session.get(Article, article_id)
    if article is None:
        return {'error': 'Articulo no encontrado.'}, 404

    article.title = title
    article.content = content
    db.session.commit()
    return {
        'id': article.id,
        'title': article.title,
        'content': article.content
    }, 200


def delete_article(article_id, user_id):
    if not user_id:
        return {'message': 'No autorizado'}, 401

    article = db.session.get(Article, article_id)
    if article is None:
        return {'error': 'Articulo no encontrado.'}, 404
    if article.user_id != user_id:
        return {'message': 'No autorizado para eliminar este articulo.'}, 403

    title = article.title
    db.session.delete(article)
    db.session.commit()
    return {'message': f'Articulo eliminado con exito. Se elimino {title}'}, 200


def get_article(article_id):
    article = db.session.get(Article, article_id)
    if article is None:
        return {'error': 'Articulo no encontrado.'}, 404

    return {
        'id': article.id,
        'title': article.title,
        'content': article.content
    }, 200


def get_favorites(user_id):
    if not user_id:
        return {'error': 'Debes iniciar sesion para ver tus favoritos.'}, 401

    user = db.session.get(User, user_id)
    if user is None:
        return {'error': 'La sesion no corresponde a un usuario valido.'}, 401

    return [
        serialize_article(article, is_favorite=True)
        for article in user.favorite_articles
    ], 200


def toggle_favorite(article_id, user_id, is_favorite):
    if not user_id:
        return {'error': 'Debes iniciar sesion para guardar favoritos.'}, 401
    if not isinstance(is_favorite, bool):
        return {'error': 'isFavorite debe ser true o false.'}, 400

    user = db.session.get(User, user_id)
    if user is None:
        return {'error': 'La sesion no corresponde a un usuario valido.'}, 401

    article = db.session.get(Article, article_id)
    if article is None:
        return {'error': 'Articulo no encontrado.'}, 404

    if is_favorite and article not in user.favorite_articles:
        user.favorite_articles.append(article)
    elif not is_favorite and article in user.favorite_articles:
        user.favorite_articles.remove(article)

    db.session.commit()
    return {'message': 'Favorito actualizado.', 'isFavorite': is_favorite}, 200
