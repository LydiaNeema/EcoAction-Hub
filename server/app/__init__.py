from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .extensions import db, migrate, api
from .config import DevelopmentConfig


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
    from app.models.profile import Profile
    from app.models.dashboard import DashboardStats, AIIntelligence, RecentActivity
    from app.models.achievements import Achievement, UserAchievement
    

    # ------------------- Register blueprints -------------------
    from app.routes.profile import profile_bp
    from app.routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    
    # Register emergency routes if they exist
    try:
        from app.routes import emergency
        app.register_blueprint(emergency.bp)
    except ImportError:
        pass  # Emergency routes not available yet
    
    # ------------------- Default route -------------------
    @app.route("/")
    def home():
        return jsonify({
            'message': 'EcoAction Hub API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'profile': '/api/profile',
                'emergency_alerts': '/api/emergency/alerts',
                'priority_alerts': '/api/emergency/alerts/priority',
                'insights': '/api/emergency/insights',
                'contacts': '/api/emergency/contacts',
                'reports': '/api/emergency/reports'
            }
        }), 200
    return app
