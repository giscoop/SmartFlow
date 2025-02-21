
"""
doc
"""

import os

from flask import Flask, render_template, session
from flask_session import Session


# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    """ Project Home Page """
    return render_template("index.html")


@app.route("/map")
def map():
    """ Render Map view """
    return render_template("map.html")


@app.route("/doc")
def doc():
    """ Render doc page """
    return render_template("doc.html")
