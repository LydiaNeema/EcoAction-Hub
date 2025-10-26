"""
Script to make a user an admin
Usage: python make_admin.py <email>
"""
import sys
from app import create_app
from app.extensions import db
from app.models.auth import User

if len(sys.argv) < 2:
    print("Usage: python make_admin.py <email>")
    sys.exit(1)

email = sys.argv[1]

app = create_app()

with app.app_context():
    user = User.query.filter_by(email=email).first()
    
    if not user:
        print(f"❌ User with email '{email}' not found")
        sys.exit(1)
    
    user.role = 'admin'
    db.session.commit()
    
    print(f"✅ User '{email}' is now an admin!")
