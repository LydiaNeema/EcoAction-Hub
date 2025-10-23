import os
from app import create_app

# Prevent Python from creating __pycache__ files
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
