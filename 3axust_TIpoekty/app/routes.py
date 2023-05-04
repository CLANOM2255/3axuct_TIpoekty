from werkzeug.security import check_password_hash, generate_password_hash
from . import app
from flask import render_template, request, redirect, make_response, jsonify, current_app

from .database import User, Event, session
from .db_controls import add_new_item, delete_user
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_login import login_required, current_user, logout_user


def add_event_to_database(event_data):
    event_data["user"] = 1
    event = Event(**event_data)
    add_new_item(event)

def commit_new_item(item):
    session.add(item)
    session.commit()
    session.close()

def create_response(status_code):
    response = make_response()
    response.status_code = status_code
    return response

@app.route("/homeworkGet", methods=["GET"])
def func1():
    data = {"arg1": "Pycharm", "arg2": "is cool"}
    response = make_response(jsonify(data))
    return response


@app.route("/homeworkPost", methods=["POST"])
def func2():
    data_from_request = request.get_json()
    print(data_from_request)
    response = make_response()
    response.status_code = 200
    return response


@app.route("/create_event", methods=["POST"])
def create_event():
    print(request.get_json())
    data_from_request = request.get_json()
    print(data_from_request)
    try:
        add_event_to_database(data_from_request)
        response = make_response({"isAdded": True})
        response.status = 200
    except Exception as e:
        print(e)
        response = make_response({"isAdded": False})
        response.status = 500
    return response

@app.route("/")
@app.route("/index")
@login_required
def index():
    return "200"

@app.route("/payment.html", methods=["POST"])
def payment():
    response = make_response(200)
    return response

@app.route("/login.html", methods=["POST"])
def login():
    data_from_request = request.get_json()

    name = data_from_request["nickname"]
    password = data_from_request["password"]

    user_check = session.query(User).where(User.nickname == name).first()
    print(user_check)
    if not user_check:
        print(name, password, "NOT LOGGED")
        response = make_response(jsonify({"isLogged": False}))
        print(response)
        return response

    if check_password_hash(user_check.password, password):
        print(name, password, "LOGGED")
        token = create_access_token(identity=user_check.id, expires_delta=timedelta(days=45))
        response = make_response(jsonify({"isLogged": True, "token": token}), 200)
        print(token)
        return response
    response = make_response(jsonify({"isLogged": False}), 401)
    print(response)
    return response

@app.route("/signup", methods=["GET", "POST"])
def signup():
    data_from_request = request.get_json()
    name = data_from_request["nickname"]
    user_check = session.query(User).where(User.nickname == name).first()
    if user_check:
        response = make_response(jsonify({"isRegistered": False, "reason": "userExists"}), 401)
        return response
    data_from_request["password"] = generate_password_hash(data_from_request["password"])
    new_user = User(**data_from_request)
    commit_new_item(new_user)
    response = make_response(jsonify({"isRegistered": True}), 200)
    return response


@app.route("/admin")
@jwt_required()
def admin():
    user_id = get_jwt_identity()
    user = session.query(User).filter(User.id == user_id).first()
    if user.nickname == "admin":
        users = session.query(User).all()
        users = [u.nickname for u in users]
        response = make_response(jsonify({"users": users}), 200)
        return response
    response = make_response(jsonify({"reason": "No"}), 401)
    return response


@app.route("/delete_user_by/<nickname>")
def delete_user_by(nickname):
    try:
        delete_user(nickname)
        response_json = {"isDeleted": True}
        status = 200
    except:
        response_json = {"isDeleted": False}
        status = 500

    response = make_response(response_json, status)
    return response
# @app.route("/test")
# @login_required
# def test():
#     import requests
#
#     response = requests.get('https://www.boredapi.com/api/activity')
#     print(response)
#     if response.status_code == 200:
#         data = response.json()["activity"]
#     else:
#         data = "ERROR"
#
#     return render_template("main.html", data=data)

# @app.route("/logout")
# @login_required
# def logout():
#     logout_user()
#     return redirect("/")

# @app.errorhandler(404)
# @app.errorhandler(500)
# @app.errorhandler(405)
# def handler_error(e):
#     return render_template("custom_error.html", error=e.code)

# @login_manager.user_loader
# def load_user(user):
#     return session.query(User).get(int(user))