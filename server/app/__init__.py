import os
from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from .extensions import db, migrate, api, bcrypt, jwt
from flask_jwt_extended import JWTManager
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
    
    # ------------------- Swagger API Documentation -------------------
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/docs"
    }
    
    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "EcoAction Hub API",
            "description": "API documentation for EcoAction Hub - A platform for community-driven climate action and emergency response",
            "version": "1.0.0",
            "contact": {
                "name": "EcoAction Hub Team",
                "url": "https://eco-action-hub-puce.vercel.app"
            }
        },
        "host": os.getenv('API_HOST', 'localhost:5000'),
        "basePath": "/",
        "schemes": ["https", "http"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
            }
        }
    }
    
    swagger = Swagger(app, config=swagger_config, template=swagger_template)

    # ------------------- Import models (for Alembic) -------------------
    from app.models.profile import Profile
    from app.models.dashboard import DashboardStats, AIIntelligence, RecentActivity
    from app.models.auth import User
    from app.models.achievements import Achievement, UserAchievement
    from app.models.emergency import EmergencyAlert, EmergencyReport, EmergencyContact
    from app.models.community import CommunityAction, ActionParticipant
    from app.models.contact import ContactMessage
    
    # ------------------- Auto Migration (Temporary) -------------------
    def add_missing_columns():
        """Add missing columns to existing tables"""
        try:
            with app.app_context():
                # Check if participation fields need to be added
                inspector = db.inspect(db.engine)
                columns = inspector.get_columns('action_participants')
                column_names = [col['name'] for col in columns]
                
                if 'participation_image' not in column_names or 'notes' not in column_names:
                    print("Adding missing participation fields...")
                    
                    with db.engine.connect() as conn:
                        if 'participation_image' not in column_names:
                            conn.execute("ALTER TABLE action_participants ADD COLUMN participation_image VARCHAR(500)")
                            print("Added participation_image column")
                        
                        if 'notes' not in column_names:
                            conn.execute("ALTER TABLE action_participants ADD COLUMN notes TEXT")
                            print("Added notes column")
                        
                        conn.commit()
                    print("Participation fields migration completed!")
                else:
                    print("Participation fields already exist")
        except Exception as e:
            print(f"Migration error (safe to ignore): {e}")
    
    # Run auto migration if environment variable is set
    if os.getenv('AUTO_MIGRATE', 'false').lower() == 'true':
        add_missing_columns()
    

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
                'contact_messages': '/api/contact/messages',
                'upload_image': '/api/upload/image'
            }
        }), 200
    return app
