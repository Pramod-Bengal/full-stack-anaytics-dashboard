import asyncio
import sqlite3
import os

async def check_users():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'analytics.db')
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, full_name, role FROM users")
    users = cursor.fetchall()
    print(f"Found {len(users)} users:")
    for user in users:
        print(user)
    
    conn.close()

if __name__ == "__main__":
    asyncio.run(check_users())
