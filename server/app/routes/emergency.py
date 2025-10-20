from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.emergency import EmergencyAlert, EmergencyReport, EmergencyContact
from app.schemas.emergency import (
    emergency_alert_schema, emergency_alerts_schema,
    emergency_report_schema, emergency_reports_schema,
    emergency_contact_schema, emergency_contacts_schema
)
from marshmallow import ValidationError
from datetime import datetime

bp = Blueprint('emergency', __name__, url_prefix='/api/emergency')

# Get all active emergency alerts
@bp.route('/alerts', methods=['GET'])
def get_alerts():
    try:
        alerts = EmergencyAlert.query.filter_by(is_active=True).order_by(EmergencyAlert.created_at.desc()).all()
        return jsonify({
            'success': True,
            'data': emergency_alerts_schema.dump(alerts)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get priority alerts (high severity)
@bp.route('/alerts/priority', methods=['GET'])
def get_priority_alerts():
    try:
        alerts = EmergencyAlert.query.filter(
            EmergencyAlert.is_active == True,
            EmergencyAlert.severity.in_(['High', 'Critical'])
        ).order_by(EmergencyAlert.created_at.desc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'data': emergency_alerts_schema.dump(alerts)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get emergency insights
@bp.route('/insights', methods=['GET'])
def get_insights():
    try:
        # Get active high severity alerts
        high_severity_alerts = EmergencyAlert.query.filter(
            EmergencyAlert.is_active == True,
            EmergencyAlert.severity.in_(['High', 'Critical'])
        ).all()
        
        # Get total active alerts
        total_active = EmergencyAlert.query.filter_by(is_active=True).count()
        
        # Get unique affected areas
        affected_areas = db.session.query(EmergencyAlert.affected_areas).filter(
            EmergencyAlert.is_active == True
        ).distinct().count()
        
        # Build insights response
        if high_severity_alerts:
            alert_types = [alert.type for alert in high_severity_alerts]
            locations = list(set([alert.location for alert in high_severity_alerts]))
            locations_str = ', '.join(locations[:2])
            alert_types_str = ' and '.join(alert_types[:2])
            
            insights = {
                'title': 'Immediate Action Required',
                'description': f'{len(high_severity_alerts)} high-severity alerts affecting {locations_str} areas. {alert_types_str} expected.',
                'recommendation': high_severity_alerts[0].recommendation if high_severity_alerts[0].recommendation else 'Stay alert and follow safety guidelines.',
                'alertTrend': f'+{len(high_severity_alerts) * 10}% This Week',
                'affectedAreas': f'{affected_areas} Districts',
                'county': high_severity_alerts[0].county,
                'aiStatus': 'AI Powered',
                'activeAlerts': total_active
            }
        else:
            insights = {
                'title': 'No Critical Alerts',
                'description': 'All systems normal. No high-severity alerts at this time.',
                'recommendation': 'Continue monitoring for updates.',
                'alertTrend': '0% This Week',
                'affectedAreas': f'{affected_areas} Districts',
                'county': 'Nairobi County',
                'aiStatus': 'AI Powered',
                'activeAlerts': total_active
            }
        
        return jsonify({
            'success': True,
            'data': insights
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get emergency contacts by service
@bp.route('/contacts', methods=['GET'])
def get_contacts():
    try:
        service = request.args.get('service', None)
        
        if service:
            contacts = EmergencyContact.query.filter_by(
                service=service,
                is_active=True
            ).all()
        else:
            contacts = EmergencyContact.query.filter_by(is_active=True).all()
        
        return jsonify({
            'success': True,
            'data': emergency_contacts_schema.dump(contacts)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Create emergency report
@bp.route('/reports', methods=['POST'])
def create_report():
    try:
        data = request.get_json()
        
        # Validate data
        validated_data = emergency_report_schema.load(data)
        
        # Create new report
        report = EmergencyReport(**validated_data)
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Emergency report submitted successfully',
            'data': emergency_report_schema.dump(report)
        }), 201
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get all emergency reports
@bp.route('/reports', methods=['GET'])
def get_reports():
    try:
        reports = EmergencyReport.query.order_by(EmergencyReport.created_at.desc()).all()
        return jsonify({
            'success': True,
            'data': emergency_reports_schema.dump(reports)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Create new alert (admin endpoint)
@bp.route('/alerts', methods=['POST'])
def create_alert():
    try:
        data = request.get_json()
        
        # Validate data
        validated_data = emergency_alert_schema.load(data)
        
        # Create new alert
        alert = EmergencyAlert(**validated_data)
        db.session.add(alert)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Emergency alert created successfully',
            'data': emergency_alert_schema.dump(alert)
        }), 201
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Update alert status
@bp.route('/alerts/<int:alert_id>', methods=['PATCH'])
def update_alert(alert_id):
    try:
        alert = EmergencyAlert.query.get_or_404(alert_id)
        data = request.get_json()
        
        # Update fields
        if 'is_active' in data:
            alert.is_active = data['is_active']
        if 'severity' in data:
            alert.severity = data['severity']
        
        alert.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Alert updated successfully',
            'data': emergency_alert_schema.dump(alert)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
