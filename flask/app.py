from flask import Flask
from flask_cors import CORS, cross_origin
from scraper import get_repositories
app = Flask(__name__)
CORS(app)

cache = {}
@app.route('/user/<username>')
def profile(username):
    if username in cache:
        return cache[username]
    else:
        repos = get_repositories(username)
        cache[username] = repos
        return repos

@app.route("/users")
def users():
    return [user for user in cache]
