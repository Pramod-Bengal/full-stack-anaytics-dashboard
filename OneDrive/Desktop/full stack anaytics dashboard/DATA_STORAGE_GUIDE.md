# 📊 Complete Guide: How to Store Data in Your SQL Analytics Dashboard

## Table of Contents
1. [Overview](#overview)
2. [Database Layer (SQL)](#database-layer)
3. [Environment Configuration](#environment-configuration)
4. [Backend API Layer (FastAPI + SQLAlchemy)](#backend-api-layer)
5. [Frontend Integration](#frontend-integration)
6. [Testing Data Storage](#testing-data-storage)

---

## Overview

Your dashboard uses **SQLite** by default for easy local development, but it is fully compatible with **PostgreSQL** for production. We use **SQLAlchemy** as the ORM (Object Relational Mapper) to handle database operations asynchronously.

---

## Database Layer (SQL)

### Models
Defined in `backend/models.py`:

- **User**: Stores user credentials and profile information in the `users` table.
- **AnalyticsData**: Stores metrics, values, and categories in the `analytics_data` table.

SQLAlchemy handles the mapping between Python classes and SQL tables.

---

## Environment Configuration

By default, the application creates a local SQLite file named `analytics.db` in the `backend/` directory.

1. **(Optional) Use PostgreSQL**:
   If you want to use PostgreSQL, create a `.env` file in the `backend/` directory.
2. **Add DATABASE_URL**:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
   ```
   *If `.env` is missing, it will default to: `sqlite+aiosqlite:///./analytics.db`*

---

## Backend API Layer (FastAPI + SQLAlchemy)

### Storing Data
Data is stored using the SQLAlchemy `Session`.

#### 1. Store Single Record
**Endpoint**: `POST /analytics/data`
**Query Parameters**: `metric_name`, `value`, `category`

```python
new_data = models.AnalyticsData(metric_name="Page Views", value=1500, category="Traffic")
db.add(new_data)
await db.commit()
await db.refresh(new_data)
```

#### 2. Store Bulk Records
**Endpoint**: `POST /analytics/data/bulk`
**Body**: A list of data objects.

```python
db.add_all(new_records)
await db.commit()
```

---

## Frontend Integration

### Angular Service
File: `frontend/src/app/core/services/analytics.service.ts`

```typescript
createAnalyticsData(metricName: string, value: number, category: string): Observable<any> {
  const params = { metric_name: metricName, value: value, category: category };
  return this.http.post(`${this.apiUrl}/analytics/data`, null, { params });
}
```

---

## Testing Data Storage

We have provided a script `test_data_storage.py` in the root directory to help you verify storage.

### How to use:
1. Ensure your backend dependencies are installed (`pip install -r requirements.txt`).
2. Run the backend server (`uvicorn main:app --reload`).
3. Run the test script:
   ```bash
   python test_data_storage.py
   ```

### Troubleshooting
- **Database Locked**: If you are manually browsing `analytics.db` with a tool, SQLite might lock the file. Close your browser tool and try again.
- **Migration Errors**: If you changed the models in `models.py`, you might need to delete `analytics.db` and restart the backend to recreate the tables.
- **PostgreSQL Connection**: If using PostgreSQL, ensure `asyncpg` is installed and your credentials in `.env` are correct.
