from datetime import datetime

from Models import db

favorite_articles = db.Table(
    'favorite_articles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('article_id', db.Integer, db.ForeignKey('article.id'), primary_key=True)
)

# Modelo
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    legacy_is_favorite = db.Column('is_favorite', db.Boolean, default=False, nullable=False)
    favorited_by = db.relationship(
        'User',
        secondary=favorite_articles,
        back_populates='favorite_articles'
    )

    def __repr__(self):
        return f'<Article {self.title}>'