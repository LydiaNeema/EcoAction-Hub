from app.extensions import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = db.relationship("Profile", uselist=False, back_populates="user")
    dashboard_stats = db.relationship("DashboardStats", backref="user", lazy=True)
    recent_activities = db.relationship("RecentActivity", backref="user", lazy=True)
    reports = db.relationship("Report", back_populates="user", lazy=True)
    report_comments = db.relationship("ReportComment", back_populates="user", lazy=True)
    # participated_actions = db.relationship("ActionParticipant", back_populates="user", lazy=True)

    serialize_rules = ('-password_hash', '-profile', '-dashboard_stats', '-recent_activities', '-reports', '-report_comments', '-participated_actions')

    def set_password(self, password: str):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def generate_reset_token(self):
        """Generate a password reset token"""
        import secrets
        from datetime import datetime, timedelta
        
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        return self.reset_token

    def verify_reset_token(self, token):
        """Verify if the reset token is valid and not expired"""
        if not self.reset_token or not self.reset_token_expires:
            return False
        
        if datetime.utcnow() > self.reset_token_expires:
            return False
        
        return self.reset_token == token

    def clear_reset_token(self):
        """Clear the reset token after use"""
        self.reset_token = None
        self.reset_token_expires = None

    def __repr__(self):
        return f"<User {self.email}>"

