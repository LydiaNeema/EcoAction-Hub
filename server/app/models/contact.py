from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


class ContactMessage(db.Model, SerializerMixin):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)  # General, Technical, Feedback, Partnership
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, in_progress, resolved
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Optional if user is logged in
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    serialize_rules = ()

    def __repr__(self):
        return f"<ContactMessage {self.email} - {self.subject}>"
