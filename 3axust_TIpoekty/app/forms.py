from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, validators

class LoginForm(FlaskForm):
    nickname = StringField("Nickname", [validators.DataRequired()])
    password = PasswordField("Password", [validators.DataRequired()])
    submit = SubmitField("Log in")

class SignupForm(LoginForm):
    email = StringField("Email", [validators.DataRequired()])
    submit = SubmitField("Sign up")

class PayForm(FlaskForm):
    cardNumber = StringField("Номер карти", [validators.DataRequired()])
    pin = PasswordField("PIN код", [validators.DataRequired()])
    cvc = StringField("CVC", [validators.DataRequired()])
    submit = SubmitField("Купити")