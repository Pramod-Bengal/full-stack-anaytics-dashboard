
import sqlite3
import os

def check_specific_user():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        email = "pramodbenagal@gmail.com"
        cursor.execute("SELECT id, email, role, full_name FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        if row:
            print(f"User Found: ID: {row[0]}, Email: {row[1]}, Role: {row[2]}, Name: {row[3]}")
        else:
            print("User not found.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    check_specific_user()
