from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.auth import User
from app.models.profile import Profile
from app.schemas.auth import register_schema, login_schema, user_schema
from marshmallow import ValidationError
import secrets
import hashlib
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    try:
        print(f"Registration attempt - Raw data: {request.get_json()}")
        data = register_schema.load(request.get_json() or {})
        print(f"Validated data: {data}")

        # Ensure email is unique
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            print(f"Email {data['email']} already exists")
            return jsonify({'success': False, 'error': 'Email already registered'}), 409

        print(f"Creating user with email: {data['email']}")
        user = User(email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()  # get user.id
        print(f"User created with ID: {user.id}")

        # Create minimal profile
        print(f"Creating profile for user {user.id} with name: {data.get('full_name')}")
        profile = Profile(user_id=user.id, full_name=data.get('full_name'))
        db.session.add(profile)
        db.session.commit()
        print(f"Profile created with ID: {profile.id}")

        token = create_access_token(identity=str(user.id))
        print(f"Token created successfully")
        
        response_data = {
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            },
            'profile': profile.to_dict() if hasattr(profile, 'to_dict') else {
                'id': profile.id,
                'user_id': profile.user_id,
                'full_name': profile.full_name
            }
        }
        print(f"Registration successful for {user.email}")
        return jsonify(response_data), 201
        
    except ValidationError as e:
        print(f"Validation error: {e.messages}")
        return jsonify({'success': False, 'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.get_json() or {})

        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({'success': False, 'error': 'No account found with this email address. Please check your email or sign up for a new account.'}), 401
        if not user.check_password(data['password']):
            return jsonify({'success': False, 'error': 'Incorrect password. Please try again or use "Forgot Password" if you need to reset it.'}), 401

        token = create_access_token(identity=str(user.id))

        profile = Profile.query.filter_by(user_id=user.id).first()
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            },
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
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        profile = Profile.query.filter_by(user_id=user_id).first()
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            },
            'profile': profile.to_dict() if profile and hasattr(profile, 'to_dict') else None
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json() or {}
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({
                'success': False, 
                'error': 'Please enter your email address'
            }), 400
        
        user = User.query.filter_by(email=email).first()
        
        # Always return success to prevent email enumeration attacks
        if user:
            # Generate reset token
            token = user.generate_reset_token()
            db.session.commit()
            
            # In a real application, you would send an email here
            # For now, we'll just log the token (remove this in production)
            print(f"Password reset token for {email}: {token}")
            print(f"Reset URL: http://localhost:3000/auth/forgot-password?token={token}")
        
        return jsonify({
            'success': True,
            'message': 'If an account with that email exists, we have sent a password reset link.'
        }), 200
        
    except Exception as e:
        print(f"Forgot password error: {str(e)}")
        return jsonify({'success': False, 'error': 'An error occurred. Please try again.'}), 500


@bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json() or {}
        token = data.get('token', '').strip()
        password = data.get('password', '').strip()
        
        if not token:
            return jsonify({
                'success': False, 
                'error': 'Invalid or missing reset token'
            }), 400
        
        if not password:
            return jsonify({
                'success': False, 
                'error': 'Please enter a new password'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'success': False, 
                'error': 'Password must be at least 6 characters long'
            }), 400
        
        # Find user with this token
        user = User.query.filter_by(reset_token=token).first()
        
        if not user or not user.verify_reset_token(token):
            return jsonify({
                'success': False, 
                'error': 'Invalid or expired reset token. Please request a new password reset.'
            }), 400
        
        # Update password and clear token
        user.set_password(password)
        user.clear_reset_token()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Your password has been successfully reset. You can now sign in with your new password.'
        }), 200
        
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        db.session.rollback()
        return jsonify({'success': False, 'error': 'An error occurred. Please try again.'}), 500

