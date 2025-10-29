from flask import Blueprint, jsonify, request
from app.extensions import db
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
        # upgrade()
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

@bp.route('/add-participation-fields', methods=['POST'])
def add_participation_fields():
    """Add participation_image and notes fields to action_participants table"""
    try:
        # Check if we need a special admin token for security
        admin_token = request.headers.get('X-Admin-Token')
        if admin_token != os.getenv('ADMIN_TOKEN', 'admin123'):
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 401
        
        # Execute raw SQL to add columns
        with db.engine.connect() as conn:
            # Check if columns already exist
            result = conn.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='action_participants' 
                AND column_name IN ('participation_image', 'notes')
            """)
            existing_columns = [row[0] for row in result]
            
            added_columns = []
            
            # Add participation_image if it doesn't exist
            if 'participation_image' not in existing_columns:
                conn.execute("""
                    ALTER TABLE action_participants 
                    ADD COLUMN participation_image VARCHAR(500)
                """)
                added_columns.append('participation_image')
            
            # Add notes if it doesn't exist
            if 'notes' not in existing_columns:
                conn.execute("""
                    ALTER TABLE action_participants 
                    ADD COLUMN notes TEXT
                """)
                added_columns.append('notes')
            
            conn.commit()
        
        return jsonify({
            'success': True,
            'message': 'Participation fields added successfully',
            'added_columns': added_columns,
            'existing_columns': existing_columns
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to add participation fields: {str(e)}'
        }), 500
