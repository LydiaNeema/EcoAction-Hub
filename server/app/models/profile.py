from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Profile(db.Model,SerializerMixin):
    __tablename__ ="profiles"

    id = db.Column(db.Integer,primary_key = True)
    #user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False,unique = True)
    full_name = db.Column(db.String(120))
    bio = db.Column(db.Text,default = "")
    county =db.Column(db.String(100))
    area = db.Column(db.String(120))
    avatar_url = db.Column(db.String(255))
    member_since = db.Column(db.Date,server_default=db.func.current_date())

    #Activity statitics
    issues_reported = db.Column(db.Integer,default = 0)
    alerts_responded =db.Column(db.Integer,default = 0)
    community_impact = db.Column(db.Integer, default = 0)
    trees_planted = db.Column(db.Integer,default = 0)
    impact_points = db.Column(db.Integer,default =0 )

    #Monthly statistics - for "+X this month"
    issues_this_month = db.Column(db.Integer,default =0)
    alerts_this_month = db.Column(db.Integer, default = 0)
    trees_this_month = db.Column(db.Integer, default = 0)

    # user = db.relationship("User",back_populates="profile")  # Commented out - User model not yet implemented
    achievements = db.relationship("Achievement",secondary="user_achievements",back_populates = "users")

    #adding serializer rules
    # serialize_rules =('-user.profile','-user.reports','-user.actions')  # Commented out - User model not yet implemented

    def get_formatted_location(self):
        if self.area and self.county:
            return f"{self.area},{self.county}"
        return self.area or self.county or "" 
    def get_member_duration(self):
        if self.member_since:
            today = datetime.now().date()  
            months = (today.year-self.member_since.year)*12 + (today.month - self.member_since.month)
            return f"{months} months"
        return "0 months"   
    def __repr__(self):
        return f"<Profile user_id = {self.user_id}>"    