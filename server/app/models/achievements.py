from app.extensions import db
from sqlalchemy_serializer import SerializerMixin

class Achievement(db.Model,SerializerMixin):
    __tablename__ = "achievements"

    id = db.Column(db.Integer,primary_key =True)
    name = db.Column(db.String(100),nullable = False) #"Tree champion","Alert Hero"
    description = db.Column(db.String(255))#"planted 20+trees"
    icon_url = db.Column(db.String(255))
    requirement_type = db.Column(db.String(50))
    #"trees_planted","alert_responded"
    requirement_value = db.Column(db.Integer)

    users = db.relationship("Profile",secondary ="user_achievements",back_populates ="achievements")

class UserAchievement(db.Model,SerializerMixin):
    __tablename__ = "user_achievements"
    id = db.Column(db.Integer,primary_key =True)
    profile_id = db.Column(db.Integer,db.ForeignKey("profiles.id"))
    achievement_id = db.Column(db.Integer,db.ForeignKey("achievements.id"))
    unlocked_at = db.Column(db.DateTime,server_default = db.func.now())
    progress = db.Column(db.Integer,default =0)

    achievement = db.relationship("Achievement")






