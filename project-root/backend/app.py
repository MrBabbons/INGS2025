from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Connessione al database
db = mysql.connector.connect(
    host="db",
    user="admin",
    password="secret",
    database="harmonization"
)

@app.route("/")
def home():
    return jsonify({"message": "Backend funzionante!"})

@app.route("/users")
def get_users():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)