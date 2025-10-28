import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables from .env file
load_dotenv()

# Prevent Python from creating __pycache__ files
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'

# Debug environment variables
print(f"OpenAI API Key detected: {bool(os.getenv('OPENAI_API_KEY'))}")

app = create_app()

# Set Flask app for CLI commands
os.environ['FLASK_APP'] = 'run.py'

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
