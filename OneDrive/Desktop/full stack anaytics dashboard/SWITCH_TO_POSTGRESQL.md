# Guide: Switch to PostgreSQL Database

## Quick Start with Docker

### Step 1: Start PostgreSQL with Docker
```bash
# Make sure Docker Desktop is running, then:
docker-compose up -d
```

This will start PostgreSQL with:
- Host: localhost
- Port: 5432
- Database: analytics_db
- Username: admin
- Password: password123

### Step 2: Update .env file
The .env file should have:
```
DATABASE_URL=postgresql+asyncpg://admin:password123@localhost:5432/analytics_db
SECRET_KEY=supersecretkeyForDevelopmentOnly12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 3: Install PostgreSQL driver
```bash
pip install asyncpg
```

### Step 4: Restart backend
```bash
uvicorn main:app --reload
```

Done! Your data will now be stored in PostgreSQL instead of SQLite.
