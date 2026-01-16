
import sqlite3
import os

def check_raw_users():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, role, full_name FROM users")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} users (raw SQLite):")
        for row in rows:
            print(f"- ID: {row[0]}, Email: {row[1]}, Role: {row[2]}, Name: {row[3]}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    check_raw_users()
