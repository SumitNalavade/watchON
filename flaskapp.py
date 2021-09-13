import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/home")
@app.route("/")
def home_page():
    return render_template("index.html")

@app.route('/search', methods=['POST'])
def search_page():
    if(request.method == 'POST'):
        searchQuery = request.form['search']

        return(render_template('search.html', searchQuery=searchQuery))