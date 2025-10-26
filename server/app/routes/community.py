from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.community import CommunityAction, ActionParticipant
from app.schemas.community import CommunityActionCreate, CommunityActionUpdate
from datetime import datetime
from pydantic import ValidationError

bp = Blueprint('community', __name__, url_prefix='/api/community')


@bp.route('/actions', methods=['GET'])
def get_actions():
    """Get all community actions with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        status = request.args.get('status', 'active')
        search = request.args.get('search', '')
        
        # Build query
        query = CommunityAction.query
        
        if category and category != 'All categories':
            query = query.filter_by(category=category)
        
        if status:
            query = query.filter_by(status=status)
        
        if search:
            query = query.filter(
                db.or_(
                    CommunityAction.title.ilike(f'%{search}%'),
                    CommunityAction.description.ilike(f'%{search}%')
                )
            )
        
        # Order by date
        actions = query.order_by(CommunityAction.date.desc()).all()
        
        return jsonify({
            'success': True,
            'actions': [action.to_dict() for action in actions],
            'count': len(actions)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions/<int:action_id>', methods=['GET'])
def get_action(action_id):
    """Get a specific community action by ID"""
    try:
        action = CommunityAction.query.get(action_id)
        
        if not action:
            return jsonify({
                'success': False,
                'error': 'Action not found'
            }), 404
        
        return jsonify({
            'success': True,
            'action': action.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions', methods=['POST'])
@jwt_required()
def create_action():
    """Create a new community action"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate data
        try:
            validated_data = CommunityActionCreate(**data)
        except ValidationError as e:
            return jsonify({
                'success': False,
                'error': 'Validation error',
                'details': e.errors()
            }), 400
        
        # Convert date string to datetime
        action_date = datetime.fromisoformat(validated_data.date.replace('Z', '+00:00'))
        
        # Create action
        action = CommunityAction(
            title=validated_data.title,
            description=validated_data.description,
            category=validated_data.category,
            location=validated_data.location,
            date=action_date,
            image=validated_data.image,
            impact_metric=validated_data.impact_metric,
            created_by=current_user_id
        )
        
        db.session.add(action)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Action created successfully',
            'action': action.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions/<int:action_id>', methods=['PUT'])
@jwt_required()
def update_action(action_id):
    """Update an existing community action"""
    try:
        current_user_id = get_jwt_identity()
        action = CommunityAction.query.get(action_id)
        
        if not action:
            return jsonify({
                'success': False,
                'error': 'Action not found'
            }), 404
        
        # Check if user is the creator (optional - can be removed for admin access)
        if action.created_by != current_user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized to update this action'
            }), 403
        
        data = request.get_json()
        
        # Validate data
        try:
            validated_data = CommunityActionUpdate(**data)
        except ValidationError as e:
            return jsonify({
                'success': False,
                'error': 'Validation error',
                'details': e.errors()
            }), 400
        
        # Update fields
        if validated_data.title:
            action.title = validated_data.title
        if validated_data.description:
            action.description = validated_data.description
        if validated_data.category:
            action.category = validated_data.category
        if validated_data.location:
            action.location = validated_data.location
        if validated_data.date:
            action.date = datetime.fromisoformat(validated_data.date.replace('Z', '+00:00'))
        if validated_data.image is not None:
            action.image = validated_data.image
        if validated_data.impact_metric is not None:
            action.impact_metric = validated_data.impact_metric
        if validated_data.status:
            action.status = validated_data.status
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Action updated successfully',
            'action': action.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions/<int:action_id>', methods=['DELETE'])
@jwt_required()
def delete_action(action_id):
    """Delete a community action"""
    try:
        current_user_id = get_jwt_identity()
        action = CommunityAction.query.get(action_id)
        
        if not action:
            return jsonify({
                'success': False,
                'error': 'Action not found'
            }), 404
        
        # Check if user is the creator
        if action.created_by != current_user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized to delete this action'
            }), 403
        
        db.session.delete(action)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Action deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions/<int:action_id>/join', methods=['POST'])
@jwt_required()
def join_action(action_id):
    """Join a community action"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if action exists
        action = CommunityAction.query.get(action_id)
        if not action:
            return jsonify({
                'success': False,
                'error': 'Action not found'
            }), 404
        
        # Check if already joined
        existing = ActionParticipant.query.filter_by(
            action_id=action_id,
            user_id=current_user_id
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'error': 'Already joined this action'
            }), 400
        
        # Create participant
        participant = ActionParticipant(
            action_id=action_id,
            user_id=current_user_id
        )
        
        # Update participants count
        action.participants_count += 1
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Successfully joined the action',
            'participant': participant.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/actions/<int:action_id>/leave', methods=['POST'])
@jwt_required()
def leave_action(action_id):
    """Leave a community action"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if action exists
        action = CommunityAction.query.get(action_id)
        if not action:
            return jsonify({
                'success': False,
                'error': 'Action not found'
            }), 404
        
        # Find participant record
        participant = ActionParticipant.query.filter_by(
            action_id=action_id,
            user_id=current_user_id
        ).first()
        
        if not participant:
            return jsonify({
                'success': False,
                'error': 'Not a participant of this action'
            }), 400
        
        # Update participants count
        if action.participants_count > 0:
            action.participants_count -= 1
        
        db.session.delete(participant)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Successfully left the action'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/my-actions', methods=['GET'])
@jwt_required()
def get_my_actions():
    """Get actions the current user has joined"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get all participant records for this user
        participants = ActionParticipant.query.filter_by(user_id=current_user_id).all()
        action_ids = [p.action_id for p in participants]
        
        # Get the actions
        actions = CommunityAction.query.filter(CommunityAction.id.in_(action_ids)).all()
        
        return jsonify({
            'success': True,
            'actions': [action.to_dict() for action in actions],
            'count': len(actions)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/stats', methods=['GET'])
def get_stats():
    """Get community statistics"""
    try:
        active_actions = CommunityAction.query.filter_by(status='active').count()
        total_participants = db.session.query(db.func.sum(CommunityAction.participants_count)).scalar() or 0
        
        return jsonify({
            'success': True,
            'stats': {
                'active_actions': active_actions,
                'total_participants': total_participants
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
