from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class CommunityAction(db.Model, SerializerMixin):
    __tablename__ = "community_actions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Environment, Agriculture, Conservation, Education
    location = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    participants_count = db.Column(db.Integer, default=0)
    impact_metric = db.Column(db.String(200), nullable=True)  # e.g., "100 trees, 50 tons CO2/year"
    status = db.Column(db.String(50), default="pending")  # pending, active, completed, rejected, cancelled
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    participants = db.relationship('ActionParticipant', back_populates='action', cascade='all, delete-orphan')

    serialize_rules = ('-participants.action',)

    def __repr__(self):
        return f"<CommunityAction {self.title}>"


class ActionParticipant(db.Model, SerializerMixin):
    __tablename__ = "action_participants"

    id = db.Column(db.Integer, primary_key=True)
    action_id = db.Column(db.Integer, db.ForeignKey('community_actions.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    action = db.relationship('CommunityAction', back_populates='participants')
    user = db.relationship('User', backref='participated_actions')

    serialize_rules = ('-action.participants', '-user.participated_actions')

    def __repr__(self):
        return f"<ActionParticipant user_id={self.user_id} action_id={self.action_id}>"
