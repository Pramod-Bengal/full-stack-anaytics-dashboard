
import sqlite3
import os

def list_admins():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        cursor.execute("SELECT id, email FROM users WHERE role = 'ADMIN' AND email != 'pramodbenagal@gmail.com'")
        rows = cursor.fetchall()
        if rows:
            print(f"Found {len(rows)} other admins:")
            for row in rows:
                print(f"- {row[1]}")
        else:
            print("No other admins found.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    list_admins()
