
import sqlite3
import os

def demote_other_admins():
    try:
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        
        target_email = "pramodbenagal@gmail.com"
        
        # Demote all admins except the target one
        cursor.execute("UPDATE users SET role = 'USER' WHERE role = 'ADMIN' AND email != ?", (target_email,))
        
        conn.commit()
        print(f"Demoted {cursor.rowcount} other admins to USER role.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    demote_other_admins()
