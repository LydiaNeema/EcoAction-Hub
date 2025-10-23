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
import os
import json

bp = Blueprint('emergency', __name__, url_prefix='/api/emergency')

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai_client = None

if OPENAI_API_KEY:
    try:
        from openai import OpenAI
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
    except ImportError:
        print("Warning: openai package not installed")
    except Exception as e:
        print(f"Warning: Could not initialize OpenAI client: {e}")


def generate_ai_alerts(location="Nairobi County"):
    """Generate emergency alerts using OpenAI."""
    if not openai_client:
        return None
    
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an emergency alert system for climate-related emergencies in Kenya. Generate realistic emergency alerts in JSON format."
                },
                {
                    "role": "user",
                    "content": f"Generate 3-5 realistic climate emergency alerts for {location}. Include floods, heat waves, air quality, or fire risks. Return as JSON array with fields: type, location, severity (Critical/High/Medium/Low), description, recommendation. Make them realistic for Nairobi's climate."
                }
            ],
            max_tokens=500,
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content
        data = json.loads(response_text)
        
        # Handle different possible JSON structures
        if 'alerts' in data:
            return data['alerts']
        elif isinstance(data, list):
            return data
        else:
            return list(data.values())[0] if data else []
            
    except Exception as e:
        print(f"OpenAI alert generation error: {e}")
        return None


def generate_ai_insights(location="Nairobi County"):
    """Generate emergency insights using OpenAI."""
    if not openai_client:
        return None
    
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant providing climate emergency insights for Kenya."
                },
                {
                    "role": "user",
                    "content": f"Generate emergency insights for {location}. Return JSON with: title (brief alert title), description (2 sentences about current situation), recommendation (safety advice), alertTrend (e.g., 'Increasing'), affectedAreas (number like '8 Locations'), activeAlerts (number 3-10). Make it realistic for Nairobi's climate."
                }
            ],
            max_tokens=300,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        insights = json.loads(completion.choices[0].message.content)
        insights['county'] = location
        insights['aiStatus'] = 'AI Powered'
        
        return insights
            
    except Exception as e:
        print(f"OpenAI insights generation error: {e}")
        return None


# Get all active emergency alerts
@bp.route('/alerts', methods=['GET'])
def get_alerts():
    try:
        # Try to generate AI alerts first
        ai_alerts = generate_ai_alerts()
        
        if ai_alerts:
            return jsonify({
                'success': True,
                'data': ai_alerts,
                'source': 'ai'
            }), 200
        
        # Fallback to database
        alerts = EmergencyAlert.query.filter_by(is_active=True).order_by(EmergencyAlert.created_at.desc()).all()
        return jsonify({
            'success': True,
            'data': emergency_alerts_schema.dump(alerts),
            'source': 'database'
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
        # Try to generate AI alerts first
        ai_alerts = generate_ai_alerts()
        
        if ai_alerts:
            # Filter for high priority
            priority_alerts = [alert for alert in ai_alerts if alert.get('severity') in ['High', 'Critical']]
            return jsonify({
                'success': True,
                'data': priority_alerts[:5],
                'source': 'ai'
            }), 200
        
        # Fallback to database
        alerts = EmergencyAlert.query.filter(
            EmergencyAlert.is_active == True,
            EmergencyAlert.severity.in_(['High', 'Critical'])
        ).order_by(EmergencyAlert.created_at.desc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'data': emergency_alerts_schema.dump(alerts),
            'source': 'database'
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
        # Try to generate AI insights first
        ai_insights = generate_ai_insights()
        
        if ai_insights:
            return jsonify({
                'success': True,
                'data': ai_insights,
                'source': 'ai'
            }), 200
        
        # Fallback to database-based insights
        high_severity_alerts = EmergencyAlert.query.filter(
            EmergencyAlert.is_active == True,
            EmergencyAlert.severity.in_(['High', 'Critical'])
        ).all()
        
        total_active = EmergencyAlert.query.filter_by(is_active=True).count()
        affected_areas = db.session.query(EmergencyAlert.affected_areas).filter(
            EmergencyAlert.is_active == True
        ).distinct().count()
        
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
            'data': insights,
            'source': 'database'
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
