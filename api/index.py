import sys
import os

# Add the backend directory to Python sys.path so we can import main.py and other files
backend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from main import app
