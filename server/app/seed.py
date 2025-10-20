from app import create_app
from app.extensions import db
from app.models.emergency import EmergencyAlert, EmergencyContact, EmergencyReport
from datetime import datetime, timedelta

def seed_emergency_data():
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Clear existing data
        EmergencyAlert.query.delete()
        EmergencyContact.query.delete()
        EmergencyReport.query.delete()
        
        # Seed Emergency Alerts
        alerts = [
            EmergencyAlert(
                type='Flood Warning',
                location='Downtown & Riverside Areas',
                severity='High',
                description='Heavy rainfall expected in the next 24-48 hours. Risk of flooding in low-lying areas.',
                recommendation='Avoid flood-prone areas and stay hydrated.',
                affected_areas='3 Districts',
                county='Nairobi County',
                is_active=True,
                expires_at=datetime.utcnow() + timedelta(days=2)
            ),
            EmergencyAlert(
                type='Extreme Heat Advisory',
                location='All Districts',
                severity='High',
                description='Temperatures expected to reach 35°C+ in the coming days.',
                recommendation='Stay hydrated, avoid outdoor activities during peak hours, and check on vulnerable individuals.',
                affected_areas='All Districts',
                county='Nairobi County',
                is_active=True,
                expires_at=datetime.utcnow() + timedelta(days=3)
            ),
            EmergencyAlert(
                type='Air Quality Alert',
                location='Industrial Area',
                severity='Medium',
                description='Elevated air pollution levels detected.',
                recommendation='Limit outdoor activities and wear masks if necessary.',
                affected_areas='1 District',
                county='Nairobi County',
                is_active=True,
                expires_at=datetime.utcnow() + timedelta(days=1)
            )
        ]
        
        # Seed Emergency Contacts
        contacts = [
            EmergencyContact(
                service='Police',
                type='Emergency Hotline',
                number='999/ 112/ 911',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Police',
                type='Direct Line',
                number='+254 20 341 4906',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Fire',
                type='Emergency Hotline',
                number='999',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Fire',
                type='Direct Line',
                number='+254 20 222 1122',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Ambulance',
                type='Emergency Hotline',
                number='999',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Ambulance',
                type='Direct Line',
                number='+254 20 272 2763',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Hospital',
                type='Nairobi Hospital',
                number='+254 20 284 5000',
                county='Nairobi County',
                location='Westlands'
            ),
            EmergencyContact(
                service='Hospital',
                type='Aga Khan Hospital',
                number='+254 20 366 2000',
                county='Nairobi County',
                location='Westlands'
            )
        ]
        
        # Add all to database
        db.session.add_all(alerts)
        db.session.add_all(contacts)
        db.session.commit()
        
        print('✅ Emergency data seeded successfully!')
        print(f'   - {len(alerts)} alerts created')
        print(f'   - {len(contacts)} emergency contacts created')

if __name__ == '__main__':
    seed_emergency_data()
