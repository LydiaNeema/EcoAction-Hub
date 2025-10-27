#!/usr/bin/env python3
"""
Seed emergency contacts data for the EcoAction-Hub application.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from app.models.emergency import EmergencyContact

def seed_emergency_contacts():
    """Seed emergency contacts data."""
    
    # Emergency contacts data for Nairobi County
    contacts_data = [
        # Police
        {
            'service': 'Police',
            'type': 'Emergency Hotline',
            'number': '999',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        {
            'service': 'Police',
            'type': 'Police Hotline',
            'number': '911',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        {
            'service': 'Police',
            'type': 'Westlands Police Station',
            'number': '+254 20 444 4444',
            'county': 'Nairobi County',
            'location': 'Westlands'
        },
        {
            'service': 'Police',
            'type': 'Central Police Station',
            'number': '+254 20 222 2222',
            'county': 'Nairobi County',
            'location': 'CBD'
        },
        
        # Fire Department
        {
            'service': 'Fire',
            'type': 'Fire Emergency',
            'number': '999',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        {
            'service': 'Fire',
            'type': 'Nairobi Fire Station',
            'number': '+254 20 555 5555',
            'county': 'Nairobi County',
            'location': 'Industrial Area'
        },
        {
            'service': 'Fire',
            'type': 'Westlands Fire Station',
            'number': '+254 20 666 6666',
            'county': 'Nairobi County',
            'location': 'Westlands'
        },
        
        # Ambulance
        {
            'service': 'Ambulance',
            'type': 'Emergency Ambulance',
            'number': '999',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        {
            'service': 'Ambulance',
            'type': 'St. John Ambulance',
            'number': '+254 20 333 3333',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        {
            'service': 'Ambulance',
            'type': 'Red Cross Ambulance',
            'number': '+254 20 777 7777',
            'county': 'Nairobi County',
            'location': 'Citywide'
        },
        
        # Hospital
        {
            'service': 'Hospital',
            'type': 'Kenyatta National Hospital',
            'number': '+254 20 272 6300',
            'county': 'Nairobi County',
            'location': 'Upper Hill'
        },
        {
            'service': 'Hospital',
            'type': 'Nairobi Hospital',
            'number': '+254 20 284 5000',
            'county': 'Nairobi County',
            'location': 'Upper Hill'
        },
        {
            'service': 'Hospital',
            'type': 'Aga Khan Hospital',
            'number': '+254 20 366 2000',
            'county': 'Nairobi County',
            'location': 'Parklands'
        },
        {
            'service': 'Hospital',
            'type': 'MP Shah Hospital',
            'number': '+254 20 427 4000',
            'county': 'Nairobi County',
            'location': 'Parklands'
        }
    ]
    
    # Clear existing contacts
    EmergencyContact.query.delete()
    
    # Add new contacts
    for contact_data in contacts_data:
        contact = EmergencyContact(**contact_data)
        db.session.add(contact)
    
    db.session.commit()
    print(f"✅ Successfully seeded {len(contacts_data)} emergency contacts")

def main():
    """Main function to run the seeding."""
    app = create_app()
    
    with app.app_context():
        try:
            seed_emergency_contacts()
            print("🎉 Emergency contacts seeding completed successfully!")
        except Exception as e:
            print(f"❌ Error seeding emergency contacts: {e}")
            db.session.rollback()

if __name__ == '__main__':
    main()
