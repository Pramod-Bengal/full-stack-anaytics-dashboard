import sqlite3
import os

# Check common locations
paths = ['backend/analytics.db', 'analytics.db', './analytics.db']
found = False

for db_path in paths:
    if os.path.exists(db_path):
        print(f"--- Checking {os.path.abspath(db_path)} ---")
        conn = sqlite3.connect(db_path)
        tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        print(f"Tables: {tables}")
        for table in tables:
            name = table[0]
            count = conn.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
            print(f"Table {name} has {count} rows.")
            if count > 0:
                print(f"Sample data from {name}:")
                rows = conn.execute(f"SELECT * FROM {name} LIMIT 3").fetchall()
                for r in rows:
                    print(f"  {r}")
        conn.close()
        found = True
        break

if not found:
    print("No database file found in common locations.")
