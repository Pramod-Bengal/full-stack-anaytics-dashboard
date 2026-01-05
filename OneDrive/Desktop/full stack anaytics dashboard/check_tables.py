import sqlite3
import os

db_path = 'backend/analytics.db'
if not os.path.exists(db_path):
    print(f"File {db_path} does not exist.")
else:
    conn = sqlite3.connect(db_path)
    tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print(f"Tables: {tables}")
    for table in tables:
        name = table[0]
        count = conn.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
        print(f"Table {name} has {count} rows.")
    conn.close()
