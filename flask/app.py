from flask import Flask
from flask_cors import CORS, cross_origin
from scraper import get_repositories
import sqlite3

from sqlite3 import Error
app = Flask(__name__)
CORS(app)

# cache = {}
connection = None
cursor = None
@app.route('/user/<username>')
def profile(username):
    user = cursor.execute(f"SELECT * FROM user WHERE name={username}").fetchone()
    if user:
        return user
    else:
        repos = []
        try:
            repos = get_repositories(username)
            cursor.execute(f"""
                INSERT INTO user VALUES
                ()
            """)
        except:
            return "user does not exist", 404
        


@app.route("/users")
def users():
    return [user for user in cache]

@app.before_first_request
def start_database():
    connection = create_connection("database.db")
    cursor = connection.cursor()



def create_connection(path):
    connection = None
    try:
        connection = sqlite3.connect(path)
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection