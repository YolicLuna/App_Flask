from werkzeug.security import generate_password_hash, check_password_hash
from Models import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique = True, nullable = False)
    email = db.Column(db.String(100), unique = True, nullable = False)
    password = db.Column(db.String(1250), nullable = False)
    articles = db.relationship('Article', backref='author', lazy=True)
    favorite_articles = db.relationship(
        'Article',
        secondary='favorite_articles',
        back_populates='favorited_by'
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
        
    def __repr__(self):
        return f'<User {self.username}>'
