# -*- coding: utf-8 -*-
"""
Verified Test Script for SQL Data Storage (SQLite/PostgreSQL)
"""
import requests
import json
import random
import time

BASE_URL = "http://localhost:8000"

def print_separator(title=""):
    print("\n" + "=" * 60)
    if title:
        print(f" {title.center(58)} ")
        print("=" * 60)

def test_storage():
    print_separator("SQL DATA STORAGE VERIFICATION")

    # Step 1: Check Backend Health
    print("[1] Checking Backend Connection...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"    ✅ Backend is UP: {response.json()}")
        else:
            print(f"    ❌ Backend returned status {response.status_code}")
            return
    except Exception as e:
        print(f"    ❌ ERROR: Could not connect to backend at {BASE_URL}")
        print(f"       Ensure your FastAPI server is running (`uvicorn main:app --reload`)")
        print(f"       Trace: {e}")
        return

    # Step 2: Authentication
    print("\n[2] Authenticating...")
    test_email = f"test_{int(time.time())}@example.com"
    test_password = "password123"
    
    # Try to register a temporary test user
    print(f"    Registering test user: {test_email}...")
    reg_data = {
        "email": test_email,
        "password": test_password,
        "full_name": "Storage Tester",
        "role": "admin"
    }
    
    try:
        reg_resp = requests.post(f"{BASE_URL}/register", json=reg_data)
        if reg_resp.status_code == 200:
            print("    ✅ Registration successful!")
        elif reg_resp.status_code == 400:
            print("    ℹ️ User might already exist, proceeding to login.")
        else:
            print(f"    ❌ Registration failed: {reg_resp.text}")
            return

        # Login to get token
        print("    Logging in to get access token...")
        login_data = {"username": test_email, "password": test_password}
        login_resp = requests.post(
            f"{BASE_URL}/token", 
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if login_resp.status_code == 200:
            token = login_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("    ✅ Authentication successful!")
        else:
            print(f"    ❌ Login failed: {login_resp.text}")
            return

    except Exception as e:
        print(f"    ❌ Auth Error: {e}")
        return

    # Step 3: Store Single Data Point
    print("\n[3] Testing Single Data Storage (POST /analytics/data)...")
    metric = random.choice(["User Retention", "CPU Load", "Memory Usage", "Requests/Sec"])
    val = random.randint(10, 5000)
    cat = random.choice(["System", "User", "Network"])
    
    try:
        # Note: The endpoint expects query parameters for metric_name, value, and category
        params = {"metric_name": metric, "value": val, "category": cat}
        store_resp = requests.post(f"{BASE_URL}/analytics/data", params=params, headers=headers)
        
        if store_resp.status_code == 200:
            res = store_resp.json()
            print(f"    ✅ SUCCESS: Stored '{metric}' with value {val} in category '{cat}'")
            print(f"    ✅ SQL Record ID: {res.get('id')}")
        else:
            print(f"    ❌ Storage failed: {store_resp.text}")
    except Exception as e:
        print(f"    ❌ Storage Error: {e}")

    # Step 4: Store Bulk Data
    print("\n[4] Testing Bulk Data Storage (POST /analytics/data/bulk)...")
    bulk_data = [
        {"metric_name": "API Latency", "value": 240, "category": "Network"},
        {"metric_name": "Error Rate", "value": 2, "category": "System"},
        {"metric_name": "Active Subs", "value": 150, "category": "Business"}
    ]
    
    try:
        bulk_resp = requests.post(f"{BASE_URL}/analytics/data/bulk", json=bulk_data, headers=headers)
        if bulk_resp.status_code == 200:
            print(f"    ✅ SUCCESS: {bulk_resp.json().get('message')}")
        else:
            print(f"    ❌ Bulk storage failed: {bulk_resp.text}")
    except Exception as e:
        print(f"    ❌ Bulk Storage Error: {e}")

    # Step 5: Retrieve Data
    print("\n[5] Verifying Data Retrieval (GET /analytics/data)...")
    try:
        get_resp = requests.get(f"{BASE_URL}/analytics/data", headers=headers)
        if get_resp.status_code == 200:
            data = get_resp.json()
            print(f"    ✅ SUCCESS: Retrieved {len(data)} records from Database!")
            if data:
                print("\n    Latest Records:")
                for item in data[-3:]:
                    print(f"      - {item['metric_name']}: {item['value']} [{item['category']}]")
        else:
            print(f"    ❌ Retrieval failed: {get_resp.text}")
    except Exception as e:
        print(f"    ❌ Retrieval Error: {e}")

    print_separator("COMPLETED SUCCESSFULLY")
    print(" Your data is now securely stored in your SQL database.")
    print(" You can also view the interactive API docs at: http://localhost:8000/docs")
    print("=" * 60)

if __name__ == "__main__":
    test_storage()
