from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Article {self.title}>'

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return 'Hola, mundo'

@app.route('/articles', methods = ['GET'])
def get_articles():
    articles = Article.query.all()
    return jsonify([{
        'id': article.id,
        'title': article.title,
        'content': article.content
    } for Article in articles])

@app.route('/create-article', methods = ['GET', 'POST'])
def create_article():
    if request.method ==  'POST':
    
        title = request.form.get('title')
        content = request.form.get('content')

        new_article = Article(title=title, content=content)
        db.session.add(new_article)
        db.session.commit()

        return f'Articulo creado {new_article}, contenido {new_article.content}'

    return '''
        <form method='POST' action="create-article">
            <label for='title' > Titulo del articulo:</label><br>
            <input type='text' id='title' name='title'><br><br>
            <label for='content' > Contenido del articulo:</label><br>
            <textarea name='content' id='content'></textarea><br><br>
            <input type='submit' id='title' value='Crear Articulo'>
        </form>    
'''

@app.route('/article/<int:article_id>')
def view_article(article_id):
    article = Article.query.get_or_404(article_id)
    return f'Articulo {article.title}, Contenido: {article.content}'


if __name__ == '__main__':
    app.run(debug=True)