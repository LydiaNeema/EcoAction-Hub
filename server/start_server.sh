#!/bin/bash
echo "Starting EcoAction Hub server with OpenAI integration..."
echo "------------------------------------------------------"
echo "Checking environment..."
python -c "import os; print(f'OPENAI_API_KEY found: {bool(os.getenv(\"OPENAI_API_KEY\"))}')"
echo "------------------------------------------------------"
python run.py
