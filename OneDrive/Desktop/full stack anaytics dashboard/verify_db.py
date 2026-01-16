import sqlite3
import os

def check_db():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'analytics.db')
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for table in tables:
        print(f" - {table[0]}")
        cursor.execute(f"PRAGMA table_info({table[0]})")
        cols = cursor.fetchall()
        for col in cols:
            print(f"   - {col[1]} ({col[2]})")
    
    print("\nData counts:")
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
        count = cursor.fetchone()[0]
        print(f" - {table[0]}: {count}")

    conn.close()

if __name__ == "__main__":
    check_db()
