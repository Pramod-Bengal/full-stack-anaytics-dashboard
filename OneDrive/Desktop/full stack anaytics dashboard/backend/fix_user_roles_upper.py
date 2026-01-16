
import sqlite3
import os

def fix_roles_upper():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        
        # Convert commonly found roles to UPPERCASE
        cursor.execute("UPDATE users SET role = 'ADMIN' WHERE role = 'admin'")
        cursor.execute("UPDATE users SET role = 'USER' WHERE role = 'user'")
        cursor.execute("UPDATE users SET role = 'EDITOR' WHERE role = 'editor'")
        cursor.execute("UPDATE users SET role = 'VIEWER' WHERE role = 'viewer'")
        
        conn.commit()
        
        print(f"Roles updated to UPPERCASE.")
        
        # Verify
        cursor.execute("SELECT id, email, role FROM users")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    fix_roles_upper()
