# app/routes/profile_routes.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.profile import Profile
#from app.models.auth import User
from app.models.achievements import Achievement, UserAchievement  # Fixed import
from datetime import datetime

# ADD THIS LINE - Define the blueprint
profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
    
    # Get user basic info
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Format response
    payload = {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "email": user.email,  # Get email from User model
        "county": profile.county,
        "area": profile.area,
        "member_since": profile.member_since.isoformat() if profile.member_since else None,
        "issues_reported": profile.issues_reported,
        "alerts_responded": profile.alerts_responded,
        "community_impact": profile.community_impact,
        "trees_planted": profile.trees_planted,
        "impact_points": profile.impact_points,
        "issues_this_month": profile.issues_this_month,
        "alerts_this_month": profile.alerts_this_month,
        "impact_this_month": profile.impact_this_month,
        "trees_this_month": profile.trees_this_month
    }
    
    return jsonify(payload), 200

@profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    """Update profile information"""
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    data = request.get_json() or {}
    
    # Update allowed fields
    allowed_fields = ["full_name", "county", "area", "bio", "avatar_url"]
    updated = False
    
    for field in allowed_fields:
        if field in data:
            setattr(profile, field, data[field])
            updated = True
    
    if updated:
        db.session.commit()
    
    return jsonify(profile.to_dict()), 200

@profile_bp.route("/<int:user_id>/stats", methods=["PATCH"])
def update_stats(user_id):
    """Update statistics"""
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    data = request.get_json() or {}
    
    # Update statistics
    stat_fields = ["issues_reported", "alerts_responded", "community_impact", "trees_planted", "impact_points"]
    monthly_fields = ["issues_this_month", "alerts_this_month", "impact_this_month", "trees_this_month"]
    
    updated = False
    for field in stat_fields + monthly_fields:
        if field in data:
            setattr(profile, field, data[field])
            updated = True
    
    if updated:
        db.session.commit()
    
    return jsonify(profile.to_dict()), 200