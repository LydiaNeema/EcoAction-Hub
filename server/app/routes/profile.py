from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.profile import Profile
from datetime import datetime

# Define the blueprint
profile_bp = Blueprint('profile_bp', __name__)

# ADD THIS ROOT ROUTE - This will make /api/profile work
@profile_bp.route("/", methods=["GET"])
def get_profiles_root():
    """Root endpoint to test if profile API is working"""
    return jsonify({
        "message": "Profile API is working!",
        "endpoints": {
            "get_profile": "GET /api/profile/<user_id>",
            "update_profile": "PUT /api/profile/<user_id>", 
            "update_stats": "PATCH /api/profile/<user_id>/stats"
        }
    }), 200

@profile_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    """Get profile by user ID"""
    try:
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        # Return profile data using to_dict method
        return jsonify(profile.to_dict()), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    """Update profile information"""
    try:
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update allowed fields
        allowed_fields = ["full_name", "county", "area", "bio", "avatar_url"]
        updated = False
        
        for field in allowed_fields:
            if field in data:
                setattr(profile, field, data[field])
                updated = True
        
        if updated:
            db.session.commit()
            return jsonify({
                "message": "Profile updated successfully",
                "profile": profile.to_dict()
            }), 200
        else:
            return jsonify({"message": "No fields to update"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@profile_bp.route("/<int:user_id>/stats", methods=["PATCH"])
def update_stats(user_id):
    """Update profile statistics"""
    try:
        profile = Profile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update statistics - ONLY fields that exist in the model
        stat_fields = ["issues_reported", "alerts_responded", "community_impact", "trees_planted", "impact_points"]
        monthly_fields = ["issues_this_month", "alerts_this_month", "trees_this_month"]
        
        updated = False
        for field in stat_fields + monthly_fields:
            if field in data:
                setattr(profile, field, data[field])
                updated = True
        
        if updated:
            db.session.commit()
            return jsonify({
                "message": "Statistics updated successfully", 
                "profile": profile.to_dict()
            }), 200
        else:
            return jsonify({"message": "No statistics to update"}), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ADD A CREATE PROFILE ENDPOINT
@profile_bp.route("/", methods=["POST"])
def create_profile():
    """Create a new profile"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Required fields
        if not data.get('user_id') or not data.get('full_name'):
            return jsonify({"error": "user_id and full_name are required"}), 400
        
        # Check if profile already exists
        existing_profile = Profile.query.filter_by(user_id=data['user_id']).first()
        if existing_profile:
            return jsonify({"error": "Profile already exists for this user"}), 400
        
        # Create new profile
        profile = Profile(
            user_id=data['user_id'],
            full_name=data['full_name'],
            county=data.get('county'),
            area=data.get('area'),
            bio=data.get('bio', ''),
            avatar_url=data.get('avatar_url')
        )
        
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({
            "message": "Profile created successfully",
            "profile": profile.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500