from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.extensions import db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactMessageCreate
from pydantic import ValidationError

bp = Blueprint('contact', __name__, url_prefix='/api/contact')


@bp.route('/messages', methods=['POST'])
def create_message():
    """Create a new contact message (public endpoint)"""
    try:
        data = request.get_json()
        
        # Validate data
        try:
            validated_data = ContactMessageCreate(**data)
        except ValidationError as e:
            return jsonify({
                'success': False,
                'error': 'Validation error',
                'details': e.errors()
            }), 400
        
        # Check if user is authenticated (optional)
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass  # User is not authenticated, that's okay
        
        # Create contact message
        message = ContactMessage(
            email=validated_data.email,
            category=validated_data.category,
            subject=validated_data.subject,
            message=validated_data.message,
            user_id=user_id
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully. We will get back to you within 24-48 hours.',
            'contact_message': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all contact messages (admin only)"""
    try:
        # Get query parameters
        status = request.args.get('status')
        category = request.args.get('category')
        
        # Build query
        query = ContactMessage.query
        
        if status:
            query = query.filter_by(status=status)
        
        if category:
            query = query.filter_by(category=category)
        
        # Order by date (newest first)
        messages = query.order_by(ContactMessage.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'messages': [msg.to_dict() for msg in messages],
            'count': len(messages)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/messages/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Get a specific contact message"""
    try:
        message = ContactMessage.query.get(message_id)
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': message.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/messages/<int:message_id>/status', methods=['PUT'])
@jwt_required()
def update_message_status(message_id):
    """Update the status of a contact message (admin only)"""
    try:
        message = ContactMessage.query.get(message_id)
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message not found'
            }), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'in_progress', 'resolved']:
            return jsonify({
                'success': False,
                'error': 'Invalid status'
            }), 400
        
        message.status = new_status
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Status updated successfully',
            'contact_message': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
