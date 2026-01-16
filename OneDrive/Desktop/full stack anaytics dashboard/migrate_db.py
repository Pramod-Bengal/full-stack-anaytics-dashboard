import sqlite3
import os

def migrate_db():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'analytics.db')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}. It will be created when you run the backend.")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if bio column exists in users table
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'bio' not in columns:
            print("Adding 'bio' column to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT")
            conn.commit()
            print("Migration successful.")
        else:
            print("'bio' column already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate_db()
