from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timedelta
from sqlalchemy import func

class DashboardStats(db.Model, SerializerMixin):
    __tablename__ = "dashboard_stats"
    
    id = db.Column(db.Integer, primary_key=True)
   #user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    # Quick Stats (cached for performance)
    total_issues_reported = db.Column(db.Integer, default=0)
    total_actions_joined = db.Column(db.Integer, default=0)
    total_community_impact = db.Column(db.Integer, default=0)
    total_trees_planted = db.Column(db.Integer, default=0)
    
    # Monthly increases
    monthly_issues_increase = db.Column(db.Integer, default=0)
    monthly_actions_increase = db.Column(db.Integer, default=0)
    
    # AI Insights data
    flood_reports_this_month = db.Column(db.Integer, default=0)
    heat_alerts_active = db.Column(db.Boolean, default=False)
    upcoming_events_count = db.Column(db.Integer, default=0)
    air_quality_improvement = db.Column(db.Float, default=0.0)  # percentage
    
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    serialize_rules = ('-user',)
    
    def __repr__(self):
        return f"<DashboardStats user_id={self.user_id}>"


class AIIntelligence(db.Model, SerializerMixin):
    __tablename__ = "ai_intelligence"
    
    id = db.Column(db.Integer, primary_key=True)
    user_county = db.Column(db.String(100), nullable=False)  # County for location-based insights
    insight_type = db.Column(db.String(50), nullable=False)  # flood, heat, air_quality, event
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default="info")  # info, warning, critical
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    
    serialize_rules = ()
    
    def __repr__(self):
        return f"<AIIntelligence {self.insight_type} for {self.user_county}>"


class RecentActivity(db.Model, SerializerMixin):
    __tablename__ = "recent_activities"
    
    id = db.Column(db.Integer, primary_key=True)
    #user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # report, community, alert
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    serialize_rules = ('-user',)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.activity_type,
            'title': self.title,
            'description': self.description,
            'time': self.get_relative_time()
        }
    
    def get_relative_time(self):
        now = datetime.utcnow()
        diff = now - self.timestamp
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds >= 3600:
            hours = diff.seconds // 3600
            return f"{hours}h ago"
        else:
            minutes = diff.seconds // 60
            return f"{minutes}m ago"