from flask import Flask
from scraper import get_repositories
app = Flask(__name__)

cache = {}
@app.route('/user/<username>')
def profile(username):
    if username in cache:
        return cache[username]
    else:
        repos = get_repositories(username)
        cache[username] = repos
        return repos
