"""
Seed script to populate community actions data
"""
from app import create_app
from app.extensions import db
from app.models.community import CommunityAction
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Clear existing data
    CommunityAction.query.delete()
    
    # Create sample community actions
    actions = [
        CommunityAction(
            title="Tree Planting Initiative",
            description="Join us to plant 100 native trees and restore the local park ecosystem. We'll provide all tools and refreshments.",
            category="Environment",
            location="Riverside Park, San Francisco",
            date=datetime.now() + timedelta(days=7),
            image="/CommunityTreeplanting.jpeg",
            participants_count=25,
            impact_metric="100 trees, 50 tons CO2/year",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Beach Cleanup Drive",
            description="Help remove plastic waste and debris from our beautiful beach. Together we can make a difference!",
            category="Environment",
            location="River side Beach, San Francisco",
            date=datetime.now() + timedelta(days=5),
            image="/CoastCleaning.jpeg",
            participants_count=40,
            impact_metric="500kg plastic removed",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Urban Garden Project",
            description="Help establish a community garden to grow fresh produce for local families. No experience needed!",
            category="Agriculture",
            location="Riverside Park, San Francisco",
            date=datetime.now() + timedelta(days=10),
            image="/UrbanGardening.jpeg",
            participants_count=15,
            impact_metric="Fresh produce for 50 families",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Wildlife Conservation Workshop",
            description="Learn about local wildlife and how to protect endangered species in our region.",
            category="Conservation",
            location="Nature Center, Golden Gate Park",
            date=datetime.now() + timedelta(days=14),
            image="/CommunityTreeplanting.jpeg",
            participants_count=30,
            impact_metric="Educate 100+ people",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Recycling Education Program",
            description="Teaching kids and adults about proper recycling and waste management practices.",
            category="Education",
            location="Community Center, Downtown",
            date=datetime.now() + timedelta(days=3),
            image="/CoastCleaning.jpeg",
            participants_count=20,
            impact_metric="200 families educated",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="River Restoration Project",
            description="Join our team to clean and restore the local river ecosystem. Help bring back native fish species.",
            category="Conservation",
            location="Sacramento River, North Bay",
            date=datetime.now() + timedelta(days=12),
            image="/UrbanGardening.jpeg",
            participants_count=35,
            impact_metric="5km river restored",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Solar Panel Installation Workshop",
            description="Learn how to install and maintain solar panels for homes. Hands-on training provided.",
            category="Education",
            location="Tech Hub, Silicon Valley",
            date=datetime.now() + timedelta(days=20),
            image="/CommunityTreeplanting.jpeg",
            participants_count=18,
            impact_metric="50 homes powered",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Organic Farming Training",
            description="Master organic farming techniques and sustainable agriculture practices.",
            category="Agriculture",
            location="Green Valley Farm, Napa",
            date=datetime.now() + timedelta(days=25),
            image="/CoastCleaning.jpeg",
            participants_count=22,
            impact_metric="10 new organic farms",
            status="active",
            created_by=1
        ),
        CommunityAction(
            title="Coastal Erosion Prevention",
            description="Help build natural barriers to prevent coastal erosion and protect marine habitats.",
            category="Environment",
            location="Pacific Coast, Half Moon Bay",
            date=datetime.now() + timedelta(days=18),
            image="/UrbanGardening.jpeg",
            participants_count=28,
            impact_metric="2km coastline protected",
            status="active",
            created_by=1
        )
    ]
    
    # Add all actions to database
    for action in actions:
        db.session.add(action)
    
    db.session.commit()
    
    print(f"✅ Successfully seeded {len(actions)} community actions!")
    print("\nActions created:")
    for action in actions:
        print(f"  - {action.title} ({action.category})")
