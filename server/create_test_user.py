"""
Create a test user with known credentials
"""
from app import create_app
from app.extensions import db
from app.models.auth import User
from app.models.profile import Profile

app = create_app()

with app.app_context():
    # Check if test user already exists
    test_user = User.query.filter_by(email='testuser@example.com').first()
    
    if test_user:
        print('Test user already exists!')
        print(f'Email: testuser@example.com')
        print(f'Password: password123')
        print(f'User ID: {test_user.id}')
    else:
        # Create test user
        test_user = User(email='testuser@example.com')
        test_user.set_password('password123')
        
        db.session.add(test_user)
        db.session.commit()
        
        # Create profile for test user
        profile = Profile(
            user_id=test_user.id,
            name='Test User',
            bio='Test account for development',
            location='Nairobi, Kenya',
            phone='+254712345678'
        )
        db.session.add(profile)
        db.session.commit()
        
        print('✅ Test user created successfully!')
        print(f'Email: testuser@example.com')
        print(f'Password: password123')
        print(f'User ID: {test_user.id}')
    
    print('\n' + '='*50)
    print('ALL USERS IN DATABASE:')
    print('='*50)
    
    all_users = User.query.all()
    for user in all_users:
        print(f'\nID: {user.id}')
        print(f'Email: {user.email}')
        print(f'Created: {user.created_at}')
        print(f'Role: {getattr(user, "role", "user")}')
        
        # Check if profile exists
        if hasattr(user, 'profile') and user.profile:
            print(f'Name: {user.profile.name}')
        print('-' * 50)
