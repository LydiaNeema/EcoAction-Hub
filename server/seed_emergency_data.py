"""
Seed script to populate emergency data
"""
from app import create_app
from app.extensions import db
from app.models.emergency import EmergencyAlert, EmergencyContact
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Clear existing data
    EmergencyAlert.query.delete()
    EmergencyContact.query.delete()
    
    # Create sample emergency alerts
    alerts = [
        EmergencyAlert(
            type="Flood Warning",
            location="Nairobi River Basin",
            severity="High",
            description="Heavy rainfall expected. River levels rising rapidly.",
            recommendation="Avoid low-lying areas. Move to higher ground if necessary.",
            affected_areas="Eastlands, Mathare, Kibera",
            county="Nairobi County",
            is_active=True,
            expires_at=datetime.now() + timedelta(days=2)
        ),
        EmergencyAlert(
            type="Air Quality Alert",
            location="Nairobi CBD",
            severity="Medium",
            description="Poor air quality due to traffic congestion and industrial emissions.",
            recommendation="Limit outdoor activities. Use masks if necessary.",
            affected_areas="CBD, Industrial Area",
            county="Nairobi County",
            is_active=True,
            expires_at=datetime.now() + timedelta(days=1)
        ),
        EmergencyAlert(
            type="Extreme Heat Warning",
            location="Nairobi County",
            severity="Medium",
            description="Temperatures expected to reach 32°C. Stay hydrated.",
            recommendation="Drink plenty of water. Avoid prolonged sun exposure.",
            affected_areas="All Districts",
            county="Nairobi County",
            is_active=True,
            expires_at=datetime.now() + timedelta(hours=12)
        )
    ]
    
    # Create emergency contacts
    contacts = [
        # Police
        EmergencyContact(
            service="Police",
            type="Emergency Hotline",
            number="999",
            location="Nairobi CBD",
            county="Nairobi County",
            is_active=True
        ),
        EmergencyContact(
            service="Police",
            type="Direct Line",
            number="112",
            location="Nationwide",
            county="Nairobi County",
            is_active=True
        ),
        
        # Fire
        EmergencyContact(
            service="Fire",
            type="Emergency Hotline",
            number="999",
            location="Nairobi County",
            county="Nairobi County",
            is_active=True
        ),
        EmergencyContact(
            service="Fire",
            type="Direct Line",
            number="020-222-1122",
            location="Nairobi",
            county="Nairobi County",
            is_active=True
        ),
        
        # Medical
        EmergencyContact(
            service="Medical",
            type="Hospital",
            number="020-272-6300",
            location="Hospital Road, Nairobi",
            county="Nairobi County",
            is_active=True
        ),
        EmergencyContact(
            service="Medical",
            type="Hospital",
            number="020-284-5000",
            location="Argwings Kodhek Road",
            county="Nairobi County",
            is_active=True
        ),
        EmergencyContact(
            service="Medical",
            type="Ambulance",
            number="020-210-0000",
            location="Nairobi",
            county="Nairobi County",
            is_active=True
        ),
        
        # Disaster
        EmergencyContact(
            service="Disaster",
            type="Emergency Hotline",
            number="1199",
            location="Nationwide",
            county="Nairobi County",
            is_active=True
        ),
        EmergencyContact(
            service="Disaster",
            type="Direct Line",
            number="020-272-1000",
            location="Nairobi",
            county="Nairobi County",
            is_active=True
        )
    ]
    
    # Add all to database
    for alert in alerts:
        db.session.add(alert)
    
    for contact in contacts:
        db.session.add(contact)
    
    db.session.commit()
    
    print(f"✅ Successfully seeded {len(alerts)} emergency alerts!")
    print(f"✅ Successfully seeded {len(contacts)} emergency contacts!")
    print("\nEmergency Alerts created:")
    for alert in alerts:
        print(f"  - {alert.type} ({alert.severity}) - {alert.location}")
    
    print("\nEmergency Contacts created:")
    services = {}
    for contact in contacts:
        if contact.service not in services:
            services[contact.service] = 0
        services[contact.service] += 1
    
    for service, count in services.items():
        print(f"  - {service}: {count} contacts")
