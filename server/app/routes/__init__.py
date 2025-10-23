from app.routes.dashboard import dashboard_bp
from app.routes.profile import profile_bp
from app.routes.emergency import emergency_bp

all_blueprints = [dashboard_bp, profile_bp, emergency_bp]
