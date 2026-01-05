import requests
import json

def debug_registration():
    url = "http://localhost:8000/register"
    # Using correct snake_case as expected by Pydantic
    data = {
        "email": "debug_user@example.com",
        "full_name": "Debug User",
        "password": "securepassword",
        "role": "admin"
    }
    
    print(f"Sending POST to {url} with data: {json.dumps(data)}")
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_registration()
