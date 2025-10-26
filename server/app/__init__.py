from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .extensions import db, migrate, api, bcrypt
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
    bcrypt.init_app(app)
    
    # Configure CORS to allow frontend access
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # ------------------- Import models (for Alembic) -------------------
    from app.models.profile import Profile
    from app.models.dashboard import DashboardStats, AIIntelligence, RecentActivity
    from app.models.auth import User
    from app.models.achievements import Achievement, UserAchievement
    from app.models.emergency import EmergencyAlert, EmergencyReport, EmergencyContact
    from app.models.community import CommunityAction, ActionParticipant
    from app.models.contact import ContactMessage
    

    # ------------------- Register blueprints -------------------
    from app.routes.profile import profile_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.reports import reports_bp
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    # Auth blueprint
    try:
        from app.routes.auth import bp as auth_bp
        app.register_blueprint(auth_bp)
    except Exception:
        pass
    # AI blueprint
    try:
        from app.routes.ai import bp as ai_bp
        app.register_blueprint(ai_bp)
    except Exception:
        pass
    
    # Register emergency routes if they exist
    try:
        from app.routes import emergency
        app.register_blueprint(emergency.bp)
    except ImportError:
        pass  # Emergency routes not available yet
    
    # Register community routes
    try:
        from app.routes import community
        app.register_blueprint(community.bp)
    except ImportError:
        pass  # Community routes not available yet
    
    # Register contact routes
    try:
        from app.routes import contact
        app.register_blueprint(contact.bp)
    except ImportError:
        pass  # Contact routes not available yet
    
    # ------------------- Default route -------------------
    @app.route("/")
    def home():
        return jsonify({
            'message': 'EcoAction Hub API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'auth': '/api/auth',
                'ai': '/api/ai',
                'profile': '/api/profile',
                'emergency_alerts': '/api/emergency/alerts',
                'priority_alerts': '/api/emergency/alerts/priority',
                'insights': '/api/emergency/insights',
                'contacts': '/api/emergency/contacts',
                'reports': '/api/emergency/reports',
                'community_actions': '/api/community/actions',
                'community_stats': '/api/community/stats',
                'contact_messages': '/api/contact/messages'
            }
        }), 200
    return app
