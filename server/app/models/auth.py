from app.extensions import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = db.relationship("Profile", uselist=False, back_populates="user")
    dashboard_stats = db.relationship("DashboardStats", backref="user", lazy=True)
    recent_activities = db.relationship("RecentActivity", backref="user", lazy=True)
    reports = db.relationship("Report", back_populates="user", lazy=True)
    report_comments = db.relationship("ReportComment", back_populates="user", lazy=True)

    serialize_rules = ('-password_hash',)

    def set_password(self, password: str):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"

