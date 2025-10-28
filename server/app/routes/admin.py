from flask import Blueprint, jsonify
from app.extensions import db
from flask_migrate import upgrade
import os

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.route('/migrate', methods=['POST', 'GET'])
def run_migration():
    """
    Emergency endpoint to run database migrations manually.
    Remove this endpoint after successful deployment!
    """
    try:
        # Allow both GET and POST for easier access
        print("Migration endpoint called!")
        
        print("Starting manual migration...")
        upgrade()
        print("Migration completed successfully!")
        
        # Verify tables exist
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        return jsonify({
            'success': True,
            'message': 'Database migration completed',
            'tables_created': tables
        }), 200
        
    except Exception as e:
        print(f"Migration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@bp.route('/check-db', methods=['GET'])
def check_database():
    """Check database connection and tables"""
    try:
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        return jsonify({
            'success': True,
            'database_connected': True,
            'tables': tables,
            'table_count': len(tables)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
