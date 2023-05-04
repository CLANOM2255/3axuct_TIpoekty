from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import secrets

app = Flask(__name__)
app.config["secret_key"] = secrets.token_hex(16)
app.config["JWT_SECRET_KEY"] = secrets.token_hex(16)

CORS(app)
JWTManager(app)

# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = 'login'

from app import routes