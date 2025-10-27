from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.schemas.ai import chat_request_schema, chat_response_schema
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

bp = Blueprint('ai', __name__, url_prefix='/api/ai')

# Initialize OpenAI client if API key is available
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai_client = None

# Debug
print(f"AI Route - OpenAI API Key available: {bool(OPENAI_API_KEY)}")
if OPENAI_API_KEY:
    try:
        from openai import OpenAI
        print(f"Setting OpenAI API key: {OPENAI_API_KEY[:15]}...")
        # Initialize the modern OpenAI client
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        print("OpenAI client initialized successfully!")
    except ImportError:
        print("Warning: openai package not installed. Install with: pip install openai")
        openai_client = None
    except Exception as e:
        print(f"Warning: Could not initialize OpenAI client: {e}")
        openai_client = None


def get_ai_response(message):
    """Get AI response using OpenAI or fallback to rule-based responses."""
    
    if openai_client:
        try:
            # Use OpenAI API
            print(f"Calling OpenAI API for message: {message[:30]}...")
            completion = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant for EcoAction Hub, a climate action platform. Help users with questions about reporting environmental issues, viewing emergency alerts, joining community actions, tree planting events, and navigating the platform. Be concise, friendly, and action-oriented."
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                max_tokens=200,
                temperature=0.7
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fall through to rule-based responses
    
    # Fallback: Rule-based responses (when no API key or API fails)
    if not message:
        return "Please type a question about climate action, emergencies, or using EcoAction."
    elif 'report' in message.lower() or 'issue' in message.lower():
        return "To report an environmental issue, go to the Reports section and fill in the location, type, and description. Our team and community will review it."
    elif 'emergency' in message.lower() or 'alert' in message.lower():
        return "You can view current emergency alerts under Emergency Alerts. For critical situations call local services immediately."
    elif 'tree' in message.lower() or 'plant' in message.lower():
        return "Great! Join a nearby tree planting event in Community Actions, or create your own and invite neighbors."
    else:
        return f"Thanks for your message: '{message}'. I can help with reporting issues, viewing emergency alerts, joining community actions, and navigating EcoAction. (Note: OpenAI integration available with API key)"


@bp.route('/status', methods=['GET'])
def status():
    """Returns status info about the AI service"""
    return jsonify({
        'success': True,
        'usingOpenAI': openai_client is not None,
        'version': 'gpt-3.5-turbo' if openai_client else 'rule-based'
    }), 200


@bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = chat_request_schema.load(request.get_json() or {})
        message = data['message'].strip()

        print(f"Chat request received: {message[:30]}...")
        print(f"Using OpenAI: {openai_client is not None}")

        reply = get_ai_response(message)

        # Log the source of the response
        source = "OpenAI" if openai_client else "Rule-based"
        print(f"Response source: {source}")

        response = {"reply": reply, "source": source}
        return jsonify(chat_response_schema.dump(response)), 200
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

