from flask import Flask
from flask_cors import CORS, cross_origin
from scraper import get_repositories
import sqlite3
from itertools import groupby

from sqlite3 import Error
app = Flask(__name__)
CORS(app)

# cache = {}
@app.route('/user/<username>')
def profile(username):
    (connection, cursor) = get_db_connection()
    repos = []
    try:
        stored_repos = connection.execute(f"""
        SELECT r.name, r.link, r.description, r.pl, u.username 
        FROM repos r JOIN users u
        ON r.user_id = u.id 
        WHERE u.username = '{username}'
        ORDER BY r.created
        """).fetchall()

        # if we don't already have the data for this user stored, scrape it
        # from github and save it to the database
        if len(stored_repos) == 0:
            repos = get_repositories(username)
            cursor.execute("INSERT INTO users (username) VALUES (?) RETURNING id", (username,))
            row = cursor.fetchone()
            (user_id, ) = row if row else None
            for repo in repos:
                cursor.execute("INSERT INTO repos (user_id, name, link, description, pl) VALUES (?, ?, ?, ?, ?)", 
                            (user_id, repo["name"], repo["link"], repo["description"], repo["pl"]))
            connection.commit()
            return {username: repos}
        
        # otherwise, return the saved data in the appropriate format
        else:
            users = {}

            for k, g in groupby(stored_repos, key=lambda user: user['username']):
                user_repos = []
                for repo in g:
                    user_repos.append({
                        "name": repo["name"],
                        "link": repo["link"],
                        "description": repo["description"],
                        "pl": repo["pl"]
                    })
                users[k] = user_repos
            return users
    except:
        return "user does not exist", 404
        


@app.route("/users")
def get_users():
    (connection, cursor) = get_db_connection()
    users = cursor.execute("SELECT username FROM users").fetchall()
    return [user["username"] for user in users]


def get_db_connection():
    connection = None
    cursor = None
    try:
        connection = sqlite3.connect("database.db")
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return (connection, cursor)