#!/usr/bin/env python3
"""
Test script to verify auth setup and identify issues
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required modules can be imported"""
    print("=== Testing Imports ===")
    
    try:
        from app import create_app
        print("✓ App import successful")
    except Exception as e:
        print(f"✗ App import failed: {e}")
        return False
    
    try:
        from app.extensions import db
        print("✓ Database extension import successful")
    except Exception as e:
        print(f"✗ Database extension import failed: {e}")
        return False
    
    try:
        from app.models.auth import User
        from app.models.profile import Profile
        print("✓ Model imports successful")
    except Exception as e:
        print(f"✗ Model imports failed: {e}")
        return False
    
    try:
        from app.schemas.auth import register_schema
        print("✓ Schema imports successful")
    except Exception as e:
        print(f"✗ Schema imports failed: {e}")
        return False
    
    return True

def test_app_creation():
    """Test if app can be created and database accessed"""
    print("\n=== Testing App Creation ===")
    
    try:
        from app import create_app
        from app.extensions import db
        from app.models.auth import User
        from app.models.profile import Profile
        
        app = create_app()
        print("✓ App created successfully")
        
        with app.app_context():
            # Test database connection
            try:
                users = User.query.all()
                print(f"✓ Database connection working. Found {len(users)} users")
                
                profiles = Profile.query.all()
                print(f"✓ Profile queries working. Found {len(profiles)} profiles")
                
                # Test a simple profile creation (rollback after)
                test_profile = Profile(user_id=999, full_name="Test User")
                print("✓ Profile object creation successful")
                
                return True
                
            except Exception as e:
                print(f"✗ Database operations failed: {e}")
                import traceback
                traceback.print_exc()
                return False
                
    except Exception as e:
        print(f"✗ App creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("EcoAction Hub - Auth Setup Test")
    print("=" * 40)
    
    if not test_imports():
        print("\n❌ Import tests failed. Fix imports before proceeding.")
        return
    
    if not test_app_creation():
        print("\nApp creation tests failed. Check database and models.")
        return
    
    print("\nAll tests passed! Auth setup looks good.")
    print("If you're still getting 500 errors, the issue might be in the request data or validation.")

if __name__ == "__main__":
    main()
