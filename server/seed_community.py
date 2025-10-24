"""
Seed script for community actions
Run this to populate the database with sample community actions
"""
from app import create_app
from app.extensions import db
from app.models.community import CommunityAction
from datetime import datetime, timedelta

app = create_app()

def seed_community_actions():
    with app.app_context():
        # Clear existing data
        print("Clearing existing community actions...")
        CommunityAction.query.delete()
        
        # Sample community actions
        actions = [
            {
                'title': 'Tree Planting Event',
                'description': 'Join us to plant 100 native trees and restore the park ecosystem. We will provide all necessary tools and refreshments. Perfect for families and individuals looking to make a positive environmental impact.',
                'category': 'Environment',
                'location': 'Riverside Park, San Francisco',
                'date': datetime.now() + timedelta(days=5),
                'image': '/CommunityTreeplanting.jpeg',
                'participants_count': 45,
                'impact_metric': '100 trees, 50 tons CO2/year',
                'status': 'active'
            },
            {
                'title': 'Beach Cleanup Drive',
                'description': 'Help remove plastic waste and debris from our beautiful beach. Join fellow community members in protecting marine life and keeping our coastline clean.',
                'category': 'Environment',
                'location': 'River side Beach, San Francisco',
                'date': datetime.now() + timedelta(days=3),
                'image': '/CoastCleaning.jpeg',
                'participants_count': 32,
                'impact_metric': '200kg waste removed',
                'status': 'active'
            },
            {
                'title': 'Urban Garden Project',
                'description': 'Help establish a community garden to grow fresh produce. Learn about sustainable agriculture and contribute to local food security.',
                'category': 'Agriculture',
                'location': 'Downtown Community Center, San Francisco',
                'date': datetime.now() + timedelta(days=7),
                'image': '/UrbanGardening.jpeg',
                'participants_count': 28,
                'impact_metric': '500 sq ft garden space',
                'status': 'active'
            },
            {
                'title': 'Wildlife Conservation Workshop',
                'description': 'Learn about local wildlife conservation efforts and how you can help protect endangered species in our region.',
                'category': 'Conservation',
                'location': 'Nature Center, San Francisco',
                'date': datetime.now() + timedelta(days=10),
                'image': None,
                'participants_count': 18,
                'impact_metric': '5 species protected',
                'status': 'active'
            },
            {
                'title': 'Climate Education Seminar',
                'description': 'Interactive seminar on climate change impacts and solutions. Suitable for all ages with expert speakers and Q&A sessions.',
                'category': 'Education',
                'location': 'City Library, San Francisco',
                'date': datetime.now() + timedelta(days=12),
                'image': None,
                'participants_count': 52,
                'impact_metric': '100+ educated',
                'status': 'active'
            },
            {
                'title': 'Recycling Awareness Campaign',
                'description': 'Help spread awareness about proper recycling practices in our community. Distribute educational materials and answer questions.',
                'category': 'Education',
                'location': 'Various locations, San Francisco',
                'date': datetime.now() + timedelta(days=15),
                'image': None,
                'participants_count': 24,
                'impact_metric': '1000+ households reached',
                'status': 'active'
            }
        ]
        
        print("Creating community actions...")
        for action_data in actions:
            action = CommunityAction(**action_data)
            db.session.add(action)
        
        db.session.commit()
        print(f"✓ Successfully created {len(actions)} community actions!")
        
        # Display created actions
        all_actions = CommunityAction.query.all()
        print("\nCreated actions:")
        for action in all_actions:
            print(f"  - {action.title} ({action.category}) - {action.participants_count} participants")

if __name__ == '__main__':
    seed_community_actions()
