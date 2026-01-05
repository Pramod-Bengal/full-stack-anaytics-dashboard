import requests
import json

BASE_URL = "http://localhost:8000"

def test_registration():
    url = f"{BASE_URL}/register"
    data = {
        "email": "stored_test@example.com",
        "full_name": "Stored User",
        "password": "testpassword123",
        "role": "user"
    }
    
    try:
        print(f"Testing registration for {data['email']}...")
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
        elif response.status_code == 400:
            print("ℹ️ User already exists.")
        else:
            print("❌ Registration failed.")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_registration()
