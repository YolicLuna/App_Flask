from flask_sqlalchemy import SQLAlchemy

from Models import db

# Modelo
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))

    def __repr__(self):
        return f'<Article {self.title}>'