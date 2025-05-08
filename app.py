from flask import Flask, render_template, request, redirect, url_for, session
from config import con
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Replace with a strong random value
app.permanent_session_lifetime = timedelta(days=7)


@app.route("/")
def index():
    return render_template('index_combined.html')

@app.route("/index")
def home():
    return render_template('index_combined.html')

# Comparison page
@app.route("/compare")
def compare():
    return render_template('compare.html')

# Login route
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        pswd = request.form['pswd']
        try:
            with con.cursor() as cur:
                cur.execute("SELECT email, pswd, name FROM user WHERE email = %s", (email,))
                user = cur.fetchone()
                if user and check_password_hash(user[1], pswd):
                    session.permanent = True
                    session['user_name'] = user[2]
                    session['user_email'] = user[0]
                    return redirect(url_for('index'))
                else:
                    return "Invalid email or password"
        except mysql.connector.Error as err:
            return f"Database error: {err}"
    return render_template('login.html')

# Signup route
@app.route('/register', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['pass']
        hashed_password = generate_password_hash(password)
        try:
            cursor = con.cursor()
            cursor.execute("INSERT INTO user (name, email, pswd) VALUES (%s, %s, %s)", (name, email, hashed_password))
            con.commit()
        except mysql.connector.Error as err:
            return f"Database error: {err}"
        finally:
            cursor.close()
        return redirect(url_for('login'))
    return render_template('signup.html')

# Logout route
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# About page
@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == "__main__":
    app.run(debug=True)
