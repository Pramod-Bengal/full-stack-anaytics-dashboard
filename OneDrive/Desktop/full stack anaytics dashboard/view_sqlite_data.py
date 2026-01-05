import sqlite3
import os

# Path to the database file
DB_PATH = os.path.join("backend", "analytics.db")

def view_data():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check for tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\n--- DATABASE TABLES ---")
        for table in tables:
            table_name = table[0]
            print(f"\nTable: {table_name}")
            
            # Fetch data from the table
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 10")
            rows = cursor.fetchall()
            
            # Get column names
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [col[1] for col in cursor.fetchall()]
            
            print(" | ".join(columns))
            print("-" * (len(" | ".join(columns))))
            
            if not rows:
                print("(No data found in this table)")
            else:
                for row in rows:
                    print(" | ".join(str(val) for val in row))
            
        conn.close()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    view_data()
