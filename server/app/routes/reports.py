from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models.reports import Report, ReportComment
from app.models.profile import Profile
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename
import uuid

reports_bp = Blueprint('reports_bp', __name__)

# Allowed file extensions for images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
UPLOAD_FOLDER = 'uploads/reports'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@reports_bp.route("/", methods=["GET"])
def get_reports_root():
    """Root endpoint for reports API"""
    return jsonify({
        "message": "Reports API is working!",
        "endpoints": {
            "create_report": "POST /api/reports",
            "get_user_reports": "GET /api/reports/user/<user_id>",
            "get_report": "GET /api/reports/<report_id>",
            "update_report": "PUT /api/reports/<report_id>",
            "get_recent_reports": "GET /api/reports/recent/<county>"
        }
    }), 200

@reports_bp.route("/", methods=["POST"])
def create_report():
    """Create a new environmental report"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Required fields
        required_fields = ['user_id', 'title', 'description', 'issue_type', 'location', 'county']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create new report
        report = Report(
            user_id=data['user_id'],
            title=data['title'],
            description=data['description'],
            issue_type=data['issue_type'],
            location=data['location'],
            county=data['county'],
            severity=data.get('severity', 'medium'),
            priority=data.get('priority', 'normal'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude')
        )
        
        # Simulate AI analysis (in real app, this would call an AI service)
        report.ai_analysis = generate_ai_analysis(data)
        report.ai_confidence = 0.85  # Simulated confidence score
        report.suggested_actions = generate_suggested_actions(data['issue_type'])
        
        db.session.add(report)
        db.session.commit()
        
        # Update user's profile stats
        update_user_report_stats(data['user_id'])
        
        return jsonify({
            "message": "Report created successfully",
            "report": report.to_dict(),
            "ai_analysis": {
                "analysis": report.ai_analysis,
                "confidence": report.ai_confidence,
                "suggested_actions": report.suggested_actions
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_reports(user_id):
    """Get all reports for a specific user"""
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', type=str)
        
        # Build query
        query = Report.query.filter_by(user_id=user_id)
        
        # Filter by status if provided
        if status:
            query = query.filter_by(status=status)
        
        # Order by creation date (newest first)
        query = query.order_by(Report.created_at.desc())
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        reports = [report.to_dict() for report in pagination.items]
        
        return jsonify({
            "reports": reports,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "pages": pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/<int:report_id>", methods=["GET"])
def get_report(report_id):
    """Get a specific report by ID"""
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404
        
        # Include comments in the response
        report_data = report.to_dict()
        report_data['comments'] = [
            {
                'id': comment.id,
                'content': comment.content,
                'is_ai_generated': comment.is_ai_generated,
                'created_at': comment.created_at.isoformat(),
                'user_name': comment.user.username if comment.user else 'Anonymous'
            }
            for comment in report.comments
        ]
        
        return jsonify({"report": report_data}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/recent/<county>", methods=["GET"])
def get_recent_reports(county):
    """Get recent reports for a specific county"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Get reports from the last 7 days
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        
        reports = Report.query.filter(
            Report.county == county,
            Report.created_at >= one_week_ago
        ).order_by(Report.created_at.desc()).limit(limit).all()
        
        # Format response for recent reports widget
        recent_reports = []
        for report in reports:
            recent_reports.append({
                'id': report.id,
                'type': report.issue_type,
                'location': report.location,
                'time_ago': report.get_time_ago(),
                'status': report.status,
                'severity': report.severity
            })
        
        return jsonify({"recent_reports": recent_reports}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/<int:report_id>", methods=["PUT"])
def update_report(report_id):
    """Update a report (status, etc.)"""
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Allowed fields to update
        allowed_fields = ['status', 'severity', 'priority', 'ai_analysis', 'suggested_actions']
        
        updated = False
        for field in allowed_fields:
            if field in data:
                setattr(report, field, data[field])
                updated = True
        
        # Update resolved_at if status changed to resolved
        if 'status' in data and data['status'] == 'resolved':
            report.resolved_at = datetime.utcnow()
        
        if updated:
            report.updated_at = datetime.utcnow()
            db.session.commit()
        
        return jsonify({
            "message": "Report updated successfully",
            "report": report.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/<int:report_id>/comments", methods=["POST"])
def add_comment(report_id):
    """Add a comment to a report"""
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404
        
        data = request.get_json()
        if not data or 'content' not in data or 'user_id' not in data:
            return jsonify({"error": "Content and user_id are required"}), 400
        
        comment = ReportComment(
            report_id=report_id,
            user_id=data['user_id'],
            content=data['content'],
            is_ai_generated=data.get('is_ai_generated', False)
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            "message": "Comment added successfully",
            "comment": {
                'id': comment.id,
                'content': comment.content,
                'is_ai_generated': comment.is_ai_generated,
                'created_at': comment.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@reports_bp.route("/stats/<int:user_id>", methods=["GET"])
def get_user_report_stats(user_id):
    """Get reporting statistics for a user"""
    try:
        # Total reports
        total_reports = Report.query.filter_by(user_id=user_id).count()
        
        # Reports by status
        status_counts = db.session.query(
            Report.status, 
            db.func.count(Report.id)
        ).filter_by(user_id=user_id).group_by(Report.status).all()
        
        # Reports this month
        start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_reports = Report.query.filter(
            Report.user_id == user_id,
            Report.created_at >= start_of_month
        ).count()
        
        stats = {
            'total_reports': total_reports,
            'monthly_reports': monthly_reports,
            'by_status': {status: count for status, count in status_counts}
        }
        
        return jsonify({"stats": stats}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper functions
def generate_ai_analysis(report_data):
    """Generate AI analysis for the report (simulated)"""
    issue_type = report_data['issue_type']
    location = report_data['location']
    
    analysis_templates = {
        'Flooding': f"AI analysis indicates potential flooding risk in {location}. Historical data shows this area is prone to water accumulation during heavy rainfall.",
        'Air Pollution': f"Air quality concerns detected in {location}. Analysis suggests monitoring PM2.5 levels and identifying potential pollution sources.",
        'Deforestation': f"Tree cover analysis for {location} shows potential deforestation activity. Satellite imagery correlation recommended.",
        'Water Pollution': f"Water quality alert for {location}. Analysis indicates possible contaminant sources nearby.",
        'Wildfire': f"Fire risk assessment for {location} shows elevated conditions. Vegetation dryness and weather patterns contribute to risk.",
        'Waste Management': f"Waste accumulation detected in {location}. Analysis suggests improved waste collection scheduling.",
    }
    
    return analysis_templates.get(issue_type, f"AI analysis initiated for {issue_type} issue in {location}. Further investigation recommended.")

def generate_suggested_actions(issue_type):
    """Generate suggested actions based on issue type"""
    actions_map = {
        'Flooding': [
            "Install temporary barriers",
            "Clear drainage systems",
            "Alert nearby residents",
            "Contact local authorities"
        ],
        'Air Pollution': [
            "Monitor air quality index",
            "Identify pollution sources",
            "Recommend mask usage",
            "Contact environmental agency"
        ],
        'Deforestation': [
            "Document tree coverage",
            "Report to forestry department",
            "Organize tree planting",
            "Community awareness campaign"
        ],
        'Water Pollution': [
            "Test water samples",
            "Identify contamination source",
            "Notify water authority",
            "Public health advisory"
        ]
    }
    
    return actions_map.get(issue_type, [
        "Document the issue thoroughly",
        "Notify relevant authorities",
        "Engage community members",
        "Monitor situation development"
    ])

def update_user_report_stats(user_id):
    """Update user's report statistics in their profile"""
    try:
        profile = Profile.query.filter_by(user_id=user_id).first()
        if profile:
            # Update total reports
            total_reports = Report.query.filter_by(user_id=user_id).count()
            profile.issues_reported = total_reports
            
            # Update monthly reports
            start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            monthly_reports = Report.query.filter(
                Report.user_id == user_id,
                Report.created_at >= start_of_month
            ).count()
            profile.issues_this_month = monthly_reports
            
            db.session.commit()
    except Exception as e:
        print(f"Error updating user stats: {e}")
        # Don't fail the main request if stats update fails