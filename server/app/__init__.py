from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .extensions import db, migrate, api
from .config import DevelopmentConfig
from app.routes import all_blueprints


def create_app():
    app = Flask(__name__)

    # ------------------- Config -------------------
    app.config.from_object(DevelopmentConfig)

    # ------------------- Extensions -------------------
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    api.init_app(app)
    CORS(app)

    # ------------------- Import models (for Alembic) -------------------
    #from app.models.auth import User
    #from app.models.dashboard import Dashboard
    #from app.models.reports import Reports
    #from app.models.community import Community
    #from app.models.ai import AI
    from app.models.profile import Profile
    #from app.models.contact import Contact
    from app.models.achievements import Achievement,UserAchievement
    

    # ------------------- Register blueprints -------------------
    #for bp in all_blueprints:
        #app.register_blueprint(bp)
    from app.routes.profile import profile_bp
    app.register_blueprint(profile_bp, url_prefix='/api/profile')  #
    # ------------------- Default route -------------------
    @app.route("/")
    def home():
        return "Backend is running"

    return app
