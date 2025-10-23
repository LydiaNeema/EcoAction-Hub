from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.dashboard import DashboardStats, AIIntelligence, RecentActivity
from app.models.profile import Profile
#from app.models.reports import Report  # You'll need to create this
#from app.models.community import CommunityAction  # You'll need to create this
from app.models.emergency import EmergencyAlert  # You'll need to create this
from datetime import datetime, timedelta
import random

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route("/<int:user_id>", methods=["GET"])
def get_dashboard_data(user_id):
    """Get complete dashboard data for a user"""
    
    # Get user profile for location and basic stats
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
    
    # Calculate or get cached stats
    dashboard_stats = calculate_dashboard_stats(user_id, profile)
    
    # Get AI insights based on user's location
    ai_insights = get_ai_insights(profile.county)
    
    # Get recent activities
    recent_activities = get_recent_activities(user_id)
    
    # Compile dashboard data
    dashboard_data = {
        "user": {
            "name": profile.full_name or "User",
            "stats": dashboard_stats
        },
        "aiInsights": ai_insights,
        "recentActivities": recent_activities
    }
    
    return jsonify(dashboard_data), 200

def calculate_dashboard_stats(user_id, profile):
    """Calculate or retrieve dashboard statistics"""
    
    # Try to get cached stats first
    stats = DashboardStats.query.filter_by(user_id=user_id).first()
    
    if not stats or (datetime.utcnow() - stats.last_updated) > timedelta(hours=1):
        # Recalculate stats if cache is stale or doesn't exist
        stats = recalculate_dashboard_stats(user_id, profile)
    
    return {
        "issuesReported": stats.total_issues_reported,
        "actionsJoined": stats.total_actions_joined,
        "communityImpact": stats.total_community_impact,
        "treesPlanted": stats.total_trees_planted,
        "monthlyIssuesIncrease": stats.monthly_issues_increase,
        "monthlyActionsIncrease": stats.monthly_actions_increase
    }

def recalculate_dashboard_stats(user_id, profile):
    """Recalculate all dashboard statistics"""
    
    # Calculate monthly increases (you'll need to implement these based on your data)
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # These would come from your actual data models
    # For now, using profile data as base
    monthly_issues = profile.issues_this_month or 0
    monthly_actions = get_monthly_community_actions(user_id, start_of_month)  # Implement this
    
    stats = DashboardStats.query.filter_by(user_id=user_id).first()
    if not stats:
        stats = DashboardStats(user_id=user_id)
    
    # Update stats from profile
    stats.total_issues_reported = profile.issues_reported or 0
    stats.total_actions_joined = get_total_community_actions(user_id)  # Implement this
    stats.total_community_impact = profile.community_impact or 0
    stats.total_trees_planted = profile.trees_planted or 0
    
    # Monthly increases
    stats.monthly_issues_increase = monthly_issues
    stats.monthly_actions_increase = monthly_actions
    
    # AI insights data (simplified - in real app, this would come from weather APIs, etc.)
    stats.flood_reports_this_month = get_flood_reports_count(profile.county, start_of_month)
    stats.heat_alerts_active = check_heat_alerts(profile.county)
    stats.upcoming_events_count = get_upcoming_events_count(profile.county)
    stats.air_quality_improvement = calculate_air_quality_improvement(profile.county)
    
    stats.last_updated = datetime.utcnow()
    
    db.session.add(stats)
    db.session.commit()
    
    return stats

def get_ai_insights(county):
    """Get AI-powered insights for user's county"""
    
    insights = AIIntelligence.query.filter(
        AIIntelligence.user_county == county,
        AIIntelligence.is_active == True,
        (AIIntelligence.expires_at.is_(None) | (AIIntelligence.expires_at > datetime.utcnow()))
    ).all()
    
    if not insights:
        # Generate default insights if none exist
        insights = generate_default_insights(county)
    
    # Format for frontend
    formatted_insights = []
    for insight in insights:
        formatted_insights.append({
            "id": insight.id,
            "title": insight.title,
            "description": insight.description,
            "icon": get_icon_for_insight(insight.insight_type),
            "type": insight.insight_type,
            "color": get_color_for_severity(insight.severity),
            "buttonText": get_button_text(insight.insight_type)
        })
    
    return formatted_insights

def get_recent_activities(user_id):
    """Get recent activities for the user"""
    
    activities = RecentActivity.query.filter_by(user_id=user_id)\
        .order_by(RecentActivity.timestamp.desc())\
        .limit(5)\
        .all()
    
    if not activities:
        # Generate some sample activities if none exist
        activities = generate_sample_activities(user_id)
    
    return [activity.to_dict() for activity in activities]

# Helper functions (implement these based on your actual data models)

def get_monthly_community_actions(user_id, start_of_month):
    """Get number of community actions joined this month"""
    # Implementation depends on your CommunityAction model
    return 2  # Placeholder

def get_total_community_actions(user_id):
    """Get total community actions joined"""
    # Implementation depends on your CommunityAction model
    return 8  # Placeholder

def get_flood_reports_count(county, start_of_month):
    """Get flood reports count for county this month"""
    # Implementation depends on your Report model
    return 3  # Placeholder

def check_heat_alerts(county):
    """Check if there are active heat alerts for county"""
    # Implementation would check weather API or your Alert model
    return True  # Placeholder

def get_upcoming_events_count(county):
    """Get count of upcoming community events in county"""
    # Implementation depends on your CommunityEvent model
    return 1  # Placeholder

def calculate_air_quality_improvement(county):
    """Calculate air quality improvement percentage"""
    # Implementation would use historical data
    return 15.0  # Placeholder

def generate_default_insights(county):
    """Generate default AI insights when none exist"""
    default_insights = [
        AIIntelligence(
            user_county=county,
            insight_type="flood",
            title="Flood Risk Increasing",
            description="Heavy rainfall predicted for this week. 3 flood reports in your area this month.",
            severity="warning"
        ),
        AIIntelligence(
            user_county=county,
            insight_type="heat",
            title="Heat Wave Advisory", 
            description="Temperature expected to reach 95°F+ this weekend. Stay hydrated and check on neighbors.",
            severity="warning"
        ),
        AIIntelligence(
            user_county=county,
            insight_type="event",
            title="Tree Planting Event",
            description="Join 45 community members this Saturday to plant 100 trees in Riverside Park.",
            severity="info"
        ),
        AIIntelligence(
            user_county=county,
            insight_type="air_quality",
            title="Air Quality Improving", 
            description="Thanks to community efforts, air quality in your area has improved by 15% this quarter.",
            severity="info"
        )
    ]
    
    db.session.bulk_save_objects(default_insights)
    db.session.commit()
    return default_insights

def generate_sample_activities(user_id):
    """Generate sample recent activities"""
    sample_activities = [
        RecentActivity(
            user_id=user_id,
            activity_type="report",
            title="Sarah M. reported a flooding issue",
            description="Downtown area near 5th Street - Storm drain overflow"
        ),
        RecentActivity(
            user_id=user_id,
            activity_type="community", 
            title="22 people joined Beach Cleanup",
            description="Marina Beach - Saturday 9 AM"
        ),
        RecentActivity(
            user_id=user_id,
            activity_type="alert",
            title="Heat Advisory issued", 
            description="Your area - Expected 95°F+ this weekend"
        )
    ]
    
    # Set timestamps to be recent
    for i, activity in enumerate(sample_activities):
        activity.timestamp = datetime.utcnow() - timedelta(hours=i*3)
    
    db.session.bulk_save_objects(sample_activities)
    db.session.commit()
    return sample_activities

def get_icon_for_insight(insight_type):
    """Map insight type to icon name"""
    icon_map = {
        "flood": "Droplets",
        "heat": "Flame", 
        "event": "Users",
        "air_quality": "Wind"
    }
    return icon_map.get(insight_type, "AlertTriangle")

def get_color_for_severity(severity):
    """Map severity to color"""
    color_map = {
        "critical": "red",
        "warning": "orange", 
        "info": "blue",
        "positive": "green"
    }
    return color_map.get(severity, "blue")

def get_button_text(insight_type):
    """Get appropriate button text for insight type"""
    button_map = {
        "flood": "View Details",
        "heat": "View Safety Tips",
        "event": "Join Event", 
        "air_quality": "Learn More"
    }
    return button_map.get(insight_type, "View Details")