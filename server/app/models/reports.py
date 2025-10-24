from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from sqlalchemy import Text

class Report(db.Model, SerializerMixin):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    # Report details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text, nullable=False)
    issue_type = db.Column(db.String(100), nullable=False)  # Flooding, Air Pollution, etc.
    location = db.Column(db.String(200), nullable=False)
    county = db.Column(db.String(100), nullable=False)
    
    # Status and tracking
    status = db.Column(db.String(50), default="pending")  # pending, under_review, in_progress, resolved, rejected
    severity = db.Column(db.String(20), default="medium")  # low, medium, high, critical
    priority = db.Column(db.String(20), default="normal")  # low, normal, high, urgent
    
    # Location coordinates (for mapping)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    # Media
    image_urls = db.Column(db.JSON, default=list)  # Store list of image URLs
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    # AI Analysis fields
    ai_analysis = db.Column(Text, nullable=True)
    ai_confidence = db.Column(db.Float, nullable=True)
    suggested_actions = db.Column(db.JSON, default=list)
    
    # Relationships
    user = db.relationship("User", back_populates="reports")
    comments = db.relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")
    
    serialize_rules = (
        '-user.reports',
        '-user.profile',
        '-comments.report'
    )
    
    def to_dict(self):
        """Convert report to dictionary with additional computed fields"""
        base_dict = super().to_dict()
        
        # Add computed fields
        base_dict['time_ago'] = self.get_time_ago()
        base_dict['status_label'] = self.get_status_label()
        base_dict['severity_color'] = self.get_severity_color()
        
        return base_dict
    
    def get_time_ago(self):
        """Get human-readable time difference"""
        now = datetime.utcnow()
        diff = now - self.created_at
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds >= 3600:
            hours = diff.seconds // 3600
            return f"{hours}h ago"
        else:
            minutes = diff.seconds // 60
            return f"{minutes}m ago"
    
    def get_status_label(self):
        """Get human-readable status label"""
        status_map = {
            'pending': 'Pending Review',
            'under_review': 'Under Review',
            'in_progress': 'In Progress',
            'resolved': 'Resolved',
            'rejected': 'Rejected'
        }
        return status_map.get(self.status, self.status)
    
    def get_severity_color(self):
        """Get color class for severity"""
        color_map = {
            'low': 'green',
            'medium': 'yellow',
            'high': 'orange',
            'critical': 'red'
        }
        return color_map.get(self.severity, 'gray')
    
    def __repr__(self):
        return f"<Report {self.id}: {self.issue_type} in {self.location}>"


class ReportComment(db.Model, SerializerMixin):
    __tablename__ = "report_comments"

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("reports.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    content = db.Column(Text, nullable=False)
    is_ai_generated = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    report = db.relationship("Report", back_populates="comments")
    user = db.relationship("User", back_populates="report_comments")
    
    serialize_rules = (
        '-report.comments',
        '-user.report_comments'
    )
    
    def __repr__(self):
        return f"<ReportComment {self.id} for Report {self.report_id}>"