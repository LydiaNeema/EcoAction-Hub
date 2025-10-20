from app.extensions import db
from datetime import datetime

class EmergencyAlert(db.Model):
    __tablename__ = 'emergency_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)  # e.g., 'Flood Warning', 'Extreme Heat'
    location = db.Column(db.String(200), nullable=False)
    severity = db.Column(db.String(50), nullable=False)  # 'Low', 'Medium', 'High', 'Critical'
    description = db.Column(db.Text)
    recommendation = db.Column(db.Text)
    affected_areas = db.Column(db.String(200))
    county = db.Column(db.String(100), default='Nairobi County')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'location': self.location,
            'severity': self.severity,
            'description': self.description,
            'recommendation': self.recommendation,
            'affected_areas': self.affected_areas,
            'county': self.county,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }

class EmergencyReport(db.Model):
    __tablename__ = 'emergency_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    reporter_name = db.Column(db.String(100))
    reporter_phone = db.Column(db.String(20))
    reporter_email = db.Column(db.String(100))
    emergency_type = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(50))
    status = db.Column(db.String(50), default='Pending')  # 'Pending', 'Under Review', 'Resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'reporter_name': self.reporter_name,
            'reporter_phone': self.reporter_phone,
            'reporter_email': self.reporter_email,
            'emergency_type': self.emergency_type,
            'location': self.location,
            'description': self.description,
            'severity': self.severity,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(100), nullable=False)  # 'Police', 'Fire', 'Ambulance', 'Hospital'
    type = db.Column(db.String(100), nullable=False)  # 'Emergency Hotline', 'Direct Line'
    number = db.Column(db.String(50), nullable=False)
    county = db.Column(db.String(100), default='Nairobi County')
    location = db.Column(db.String(200), default='Westlands')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'service': self.service,
            'type': self.type,
            'number': self.number,
            'county': self.county,
            'location': self.location,
            'is_active': self.is_active
        }
