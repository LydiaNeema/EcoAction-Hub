import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .extensions import db, migrate, api, bcrypt
from .config import DevelopmentConfig, ProductionConfig


def create_app():
    app = Flask(__name__)

    # ------------------- Config -------------------
    # Use production config if FLASK_ENV is production, otherwise development
    config_class = ProductionConfig if os.getenv('FLASK_ENV') == 'production' else DevelopmentConfig
    app.config.from_object(config_class)

    # ------------------- Extensions -------------------
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    api.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS to allow frontend access
    allowed_origins = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://eco-action-hub-puce.vercel.app"  # Production Vercel frontend
    ]
    
    # Add custom frontend URL from environment if provided
    frontend_url = os.getenv('FRONTEND_URL')
    if frontend_url and frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)
        print(f"✓ Added custom frontend URL to CORS: {frontend_url}")
    
    print(f"✓ CORS allowed origins: {allowed_origins}")
    
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
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
        print("✓ Auth blueprint registered successfully")
    except Exception as e:
        print(f"✗ Auth blueprint registration failed: {e}")
    
    # AI blueprint
    try:
        from app.routes.ai import bp as ai_bp
        app.register_blueprint(ai_bp)
        print("✓ AI blueprint registered successfully")
    except Exception as e:
        print(f"✗ AI blueprint registration failed: {e}")
    
    # Register emergency routes
    try:
        from app.routes import emergency
        app.register_blueprint(emergency.bp)
        print("✓ Emergency blueprint registered successfully")
    except Exception as e:
        print(f"✗ Emergency blueprint registration failed: {e}")
    
    # Register community routes
    try:
        from app.routes import community
        app.register_blueprint(community.bp)
        print("✓ Community blueprint registered successfully")
    except Exception as e:
        print(f"✗ Community blueprint registration failed: {e}")
    
    # Register contact routes
    try:
        from app.routes import contact
        app.register_blueprint(contact.bp)
        print("✓ Contact blueprint registered successfully")
    except Exception as e:
        print(f"✗ Contact blueprint registration failed: {e}")
    
    # Register admin routes (for manual migration)
    try:
        from app.routes import admin
        app.register_blueprint(admin.bp)
        print("✓ Admin blueprint registered successfully")
    except Exception as e:
        print(f"✗ Admin blueprint registration failed: {e}")
    
    # Register upload routes
    try:
        from app.routes import upload
        app.register_blueprint(upload.bp)
        print("✓ Upload blueprint registered successfully")
    except Exception as e:
        print(f"✗ Upload blueprint registration failed: {e}")
    
    # ------------------- Static file serving -------------------
    @app.route('/uploads/<filename>')
    def serve_uploaded_file(filename):
        """Serve uploaded images"""
        from flask import send_from_directory
        from werkzeug.utils import secure_filename
        import os
        
        try:
            # Validate filename
            if not filename or '..' in filename:
                return jsonify({'error': 'Invalid filename'}), 400
            
            # Construct upload directory path (backend-specific)
            upload_dir = os.path.join(app.root_path, '..', 'uploads')
            
            # Check if file exists
            file_path = os.path.join(upload_dir, secure_filename(filename))
            if not os.path.exists(file_path):
                return jsonify({'error': 'File not found'}), 404
            
            return send_from_directory(upload_dir, secure_filename(filename))
            
        except Exception as e:
            return jsonify({'error': f'Serve failed: {str(e)}'}), 500

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
