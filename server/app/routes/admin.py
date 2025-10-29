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
