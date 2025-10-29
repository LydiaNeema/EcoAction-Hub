from flask import Blueprint, jsonify, request
from app.extensions import db
import os

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@bp.route('/status', methods=['GET'])
def admin_status():
    """Simple admin status check"""
    return jsonify({
        'success': True,
        'message': 'Admin routes are working',
        'status': 'ok'
    }), 200

@bp.route('/delete-all-actions', methods=['POST'])
def delete_all_actions():
    """Delete all community actions (for fresh start)"""
    try:
        # Check for admin token
        admin_token = request.headers.get('X-Admin-Token')
        if admin_token != os.getenv('ADMIN_TOKEN', 'admin123'):
            return jsonify({
                'success': False,
                'error': 'Unauthorized - Admin token required'
            }), 401
        
        # Import models
        from app.models.community import CommunityAction, ActionParticipant
        
        # Count before deletion
        actions_count = CommunityAction.query.count()
        participants_count = ActionParticipant.query.count()
        
        # Delete all participants first (foreign key constraint)
        ActionParticipant.query.delete()
        
        # Delete all actions
        CommunityAction.query.delete()
        
        # Commit the changes
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'All actions deleted successfully',
            'deleted_actions': actions_count,
            'deleted_participants': participants_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to delete actions: {str(e)}'
        }), 500

@bp.route('/reset-action-ids', methods=['POST'])
def reset_action_ids():
    """Reset action ID sequence (PostgreSQL)"""
    try:
        # Check for admin token
        admin_token = request.headers.get('X-Admin-Token')
        if admin_token != os.getenv('ADMIN_TOKEN', 'admin123'):
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 401
        
        # Reset the sequence for fresh IDs
        with db.engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("ALTER SEQUENCE community_actions_id_seq RESTART WITH 1"))
            conn.execute(text("ALTER SEQUENCE action_participants_id_seq RESTART WITH 1"))
            conn.commit()
        
        return jsonify({
            'success': True,
            'message': 'Action ID sequences reset to 1'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to reset sequences: {str(e)}'
        }), 500
