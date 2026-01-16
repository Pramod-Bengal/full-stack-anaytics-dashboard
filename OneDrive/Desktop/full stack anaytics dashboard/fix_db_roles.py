import sqlite3
import os

def fix_roles():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'analytics.db')
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("SELECT id, role FROM users")
    users = cursor.fetchall()
    
    for user_id, role in users:
        if role and role != role.lower():
            new_role = role.lower()
            print(f"Updating user {user_id}: {role} -> {new_role}")
            cursor.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    
    conn.commit()
    print("Role normalization complete.")
    conn.close()

if __name__ == "__main__":
    fix_roles()
