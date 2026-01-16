
import sqlite3
import os

def fix_roles():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        
        # Convert all roles to lowercase
        cursor.execute("UPDATE users SET role = LOWER(role)")
        conn.commit()
        
        print(f"Updated {cursor.rowcount} rows. Roles normalized to lowercase.")
        
        # Verify
        cursor.execute("SELECT id, email, role FROM users WHERE role NOT IN ('admin', 'user', 'viewer', 'editor')")
        invalid = cursor.fetchall()
        if invalid:
            print("Warning: Found potentially invalid roles:", invalid)
        else:
            print("All roles seem valid now.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    fix_roles()
