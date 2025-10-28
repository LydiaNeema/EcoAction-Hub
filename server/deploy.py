#!/usr/bin/env python3
"""
Deployment script for EcoAction-Hub backend on Render.com
This script handles database migrations and optional seeding
"""

import os
import sys
from flask import Flask
from flask_migrate import upgrade

def deploy():
    """Run deployment tasks."""
    from app import create_app
    from app.extensions import db
    
    app = create_app()
    
    with app.app_context():
        # Run database migrations
        print("Running database migrations...")
        try:
            upgrade()
            print("✓ Database migrations completed successfully")
        except Exception as e:
            print(f"✗ Migration failed: {e}")
            return False
        
        # Check if we should seed data (only for first deployment)
        seed_data = os.getenv('SEED_DATA', 'false').lower() == 'true'
        
        if seed_data:
            print("Seeding initial data...")
            try:
                # Import seeding functions
                from seed_emergency_contacts import seed_emergency_contacts
                from seed_community import seed_community_actions
                
                # Seed emergency contacts
                seed_emergency_contacts()
                print("✓ Emergency contacts seeded")
                
                # Seed community actions
                seed_community_actions()
                print("✓ Community actions seeded")
                
            except Exception as e:
                print(f"⚠ Seeding failed (this is optional): {e}")
                # Don't fail deployment if seeding fails
        
        print("🎉 Deployment completed successfully!")
        return True

if __name__ == '__main__':
    success = deploy()
    sys.exit(0 if success else 1)
