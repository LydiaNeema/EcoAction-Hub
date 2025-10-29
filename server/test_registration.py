#!/usr/bin/env python3
"""
Test registration functionality
"""

import os
import sys
import requests
import json

def test_registration():
    """Test the registration endpoint"""
    print("=== Testing Registration ===")
    
    url = "http://127.0.0.1:5000/api/auth/register"
    
    test_data = {
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        print(f"Sending POST request to {url}")
        print(f"Data: {test_data}")
        
        response = requests.post(url, json=test_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("Registration successful!")
            return True
        elif response.status_code == 409:
            print("User already exists (this is normal)")
            return True
        else:
            print("Registration failed")
            return False
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to server. Make sure Flask is running on http://127.0.0.1:5000")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_registration()
