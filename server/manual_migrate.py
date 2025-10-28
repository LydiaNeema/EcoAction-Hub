#!/usr/bin/env python3
"""
Manual migration script to run directly on Render
Upload this file and run it via Render's "Jobs" feature
"""
import os
import sys

# Set environment for production
os.environ['FLASK_ENV'] = 'production'

print("=" * 50)
print("MANUAL DATABASE MIGRATION SCRIPT")
print("=" * 50)

try:
    print("\n1. Loading Flask app...")
    from app import create_app
    from app.extensions import db
    from flask_migrate import init, migrate, upgrade
    
    print("2. Creating app context...")
    app = create_app()
    
    with app.app_context():
        print("3. Checking database connection...")
        # Test connection
        try:
            db.engine.execute("SELECT 1")
            print("   ✓ Database connected successfully")
        except Exception as e:
            print(f"   ✗ Database connection failed: {e}")
            sys.exit(1)
        
        print("\n4. Initializing migrations...")
        try:
            init()
            print("   ✓ Migrations initialized")
        except:
            print("   ℹ Migrations already initialized")
        
        print("\n5. Running database upgrade...")
        upgrade()
        print("   ✓ Database migrations completed!")
        
        print("\n6. Verifying tables...")
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"\n   Created {len(tables)} tables:")
        for table in tables:
            print(f"   - {table}")
        
        # Test by creating a test user
        print("\n7. Testing database with sample query...")
        from app.models.auth import User
        test_count = User.query.count()
        print(f"   ✓ Users table accessible. Current users: {test_count}")
        
        print("\n" + "=" * 50)
        print("SUCCESS! Database is ready for use.")
        print("=" * 50)
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
