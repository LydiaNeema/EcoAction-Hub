from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, cors, migrate

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)
    
    # Root route
    @app.route('/')
    def index():
        return jsonify({
            'message': 'EcoAction Hub API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'emergency_alerts': '/api/emergency/alerts',
                'priority_alerts': '/api/emergency/alerts/priority',
                'insights': '/api/emergency/insights',
                'contacts': '/api/emergency/contacts',
                'reports': '/api/emergency/reports'
            }
        }), 200
    
    # Register blueprints
    from app.routes import emergency
    app.register_blueprint(emergency.bp)
    
    return app
