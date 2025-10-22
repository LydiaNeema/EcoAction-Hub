from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.auth import User
from app.models.profile import Profile
from app.schemas.auth import register_schema, login_schema, user_schema
from marshmallow import ValidationError

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    try:
        data = register_schema.load(request.get_json() or {})

        # Ensure email is unique
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'error': 'Email already registered'}), 409

        user = User(email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()  # get user.id

        # Create minimal profile
        profile = Profile(user_id=user.id, full_name=data.get('full_name'))
        db.session.add(profile)
        db.session.commit()

        token = create_access_token(identity=user.id)
        return jsonify({
            'success': True,
            'token': token,
            'user': user_schema.dump(user),
            'profile': profile.to_dict() if hasattr(profile, 'to_dict') else {
                'id': profile.id,
                'user_id': profile.user_id,
                'full_name': profile.full_name
            }
        }), 201
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.get_json() or {})

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

        token = create_access_token(identity=user.id)

        profile = Profile.query.filter_by(user_id=user.id).first()
        return jsonify({
            'success': True,
            'token': token,
            'user': user_schema.dump(user),
            'profile': profile.to_dict() if profile and hasattr(profile, 'to_dict') else None
        }), 200
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        profile = Profile.query.filter_by(user_id=user_id).first()
        return jsonify({
            'success': True,
            'user': user_schema.dump(user),
            'profile': profile.to_dict() if profile and hasattr(profile, 'to_dict') else None
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

