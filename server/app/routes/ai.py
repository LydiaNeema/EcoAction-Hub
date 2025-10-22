from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.schemas.ai import chat_request_schema, chat_response_schema

bp = Blueprint('ai', __name__, url_prefix='/api/ai')


@bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = chat_request_schema.load(request.get_json() or {})
        message = data['message'].strip()

        # Very simple rule-based response as placeholder
        if not message:
            reply = "Please type a question about climate action, emergencies, or using EcoAction."
        elif 'report' in message.lower() or 'issue' in message.lower():
            reply = "To report an environmental issue, go to the Reports section and fill in the location, type, and description. Our team and community will review it."
        elif 'emergency' in message.lower() or 'alert' in message.lower():
            reply = "You can view current emergency alerts under Emergency Alerts. For critical situations call local services immediately."
        elif 'tree' in message.lower() or 'plant' in message.lower():
            reply = "Great! Join a nearby tree planting event in Community Actions, or create your own and invite neighbors."
        else:
            reply = f"Thanks for your message: '{message}'. I can help with reporting issues, viewing emergency alerts, joining community actions, and navigating EcoAction."

        response = {"reply": reply}
        return jsonify(chat_response_schema.dump(response)), 200
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

