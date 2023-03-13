from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from scraper import get_repositories
import sqlite3
from itertools import groupby

from sqlite3 import Error
app = Flask(__name__)
CORS(app)

def scrape_user(username):
    (connection, cursor) = get_db_connection()
    try:
        repos = get_repositories(username)
    except Exception as e:
        return str(e), 400
    



    cursor.execute("INSERT INTO users (username) VALUES (?) RETURNING id, created", (username,))
    row = cursor.fetchone()
    (user_id, created, ) = row if row else None
    for repo in repos:
        cursor.execute("INSERT INTO repos (user_id, name, link, description, pl) VALUES (?, ?, ?, ?, ?)", 
                    (user_id, repo["name"], repo["link"], repo["description"], repo["pl"]))
    connection.commit()
    return {
        "username": username,
        "created": created,
        "repos": repos
        }

@app.route('/user/<username>')
def profile(username):
    (connection, cursor) = get_db_connection()
    repos = []
    stored_repos = []
    try:
        stored_repos = connection.execute(f"""
        SELECT r.name, r.link, r.description, r.pl, u.username, u.created
        FROM repos r JOIN users u
        ON r.user_id = u.id 
        WHERE u.username = '{username}'
        ORDER BY r.created
        """).fetchall()
    except:
        return "user does not exist", 404

    # if we don't already have the data for this user stored, scrape it
    # from github and save it to the database
    if len(stored_repos) == 0:
        return scrape_user(username)

    
    # otherwise, return the saved data in the appropriate format
    else:
        users = {}
        repos = []
        username = ""
        created = ""
        for repo in stored_repos:
            repos.append({
                "name": repo["name"],
                "link": repo["link"],
                "description": repo["description"],
                "pl": repo["pl"]
            })
            created = repo["created"]
            username = repo["username"]

        return {
            "username": username,
            "created": created,
            "repos": repos
            }

        


@app.route("/users")
def get_users():
    (connection, cursor) = get_db_connection()
    users = cursor.execute("SELECT username FROM users").fetchall()
    return [user["username"] for user in users]

@app.route('/refresh/<username>')
def refresh(username):
    (connection, cursor) = get_db_connection()
    # try:
    # delete old 
    cursor.execute("DELETE FROM users WHERE username=? RETURNING id", (username, ))
    row = cursor.fetchone()
    (user_id, ) = row if row else None
    print(user_id)
    cursor.execute("DELETE FROM repos WHERE user_id=?", (user_id, ))
    connection.commit()
    scrape_user(username)
    return jsonify(success=True)
    # except Exception as e:
    #     return str(e), 400

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