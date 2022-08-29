from flask import Flask, jsonify , request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import flask_marshmallow import Marshmallow


app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flask/user'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Articles(db.Model)
    

class ArticleSchema(ma.Schema):
    class Meta:
        fields = ('user_id','user_token','user_name','user_email','user_password','user_salt')


article_schema = ArticleSchema()
articles_schema = ArticleSchema(many=True)

@app.route('/add', methods = ['GET'])
def add_article():
    user_id = request.json['user_id']
    user_name = request.json['user_name']

    articles = Articles(user_id,user_name)
    db.session.add(articles)
    db.session.commit()
    return article_schema.jsonify()


class HelloWorld(Resource):
    def get(self):
        return {"data": "Hello World"}
    def post(self):
        return{"data": "Posted"}

api.add_resource(HelloWorld, "/helloworld")


if __name__ == "__main__":
    app.run(debug=True)
