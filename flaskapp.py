from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/home")
@app.route("/")
def home_page():
    return render_template("index.html")
