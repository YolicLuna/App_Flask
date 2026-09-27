from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db,String(50), unique = True, nullable = False)
    email = db.Column(db,String(100), unique = True, nullable = False)
    password = db.Column(db,String(1250), nullable = False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password_hash(self, password):
        return check_password_hash(self.password_hash, password)
        
    def __repr__(self):
        return f'<User {self.username}>'
