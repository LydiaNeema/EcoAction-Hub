#!/usr/bin/env python3
"""
Simple migration script for Render deployment
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Starting migration script...")

try:
    from app import create_app
    from app.extensions import db
    from flask_migrate import upgrade
    
    print("✓ Imported Flask app and extensions")
    
    app = create_app()
    print("✓ Created Flask app")
    
    with app.app_context():
        print("✓ Entered app context")
        
        # Run migrations
        print("Running database migrations...")
        upgrade()
        print("✓ Database migrations completed")
        
        # Check if emergency contacts exist
        try:
            from app.models.emergency import EmergencyContact
            contact_count = EmergencyContact.query.count()
            print(f"✓ Found {contact_count} emergency contacts in database")
            
            if contact_count == 0:
                print("No emergency contacts found. You can seed them by calling /api/emergency/seed-contacts")
            
        except Exception as e:
            print(f"⚠ Could not check emergency contacts: {e}")
        
        print("Migration script completed successfully!")
        
except Exception as e:
    print(f"Migration failed: {e}")
    sys.exit(1)
