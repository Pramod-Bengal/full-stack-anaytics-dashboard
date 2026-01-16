# Full-Stack Analytics Dashboard

A modern full-stack analytics dashboard built with a FastAPI backend and an Angular frontend.

## Technologies Used

### Backend
- **Language:** Python
- **Framework:** FastAPI
- **Database:** SQL (SQLite for dev, PostgreSQL compatible) via SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)

### Frontend
- **Language:** TypeScript
- **Framework:** Angular 17
- **Styling:** CSS (Modern styling with components)

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js & npm (latest LTS recommended)
- MongoDB instance (Atlas or Local)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables (optional for SQLite):
   Create a `.env` file in the `backend` directory if you want to use PostgreSQL:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

---

## Infrastructure


---

## Useful Development & Management Commands

All commands should be run from the `backend/` directory.

### **1. View Database Data (Users & Analytics)**
View a formatted list of all users and the latest 50 analytics records directly in your terminal.
```bash
python show_db_data.py
```

### **2. Set Primary Admin Account**
Sets `pramodbenagal@gmail.com` as the **only** ADMIN user and resets their password to `Pramod@2004`. Also demotes any other existing admins to standard USER role to ensure exclusivity.
```bash
python set_admin.py
```

### **3. Fix User Roles (Maintenance)**
If you encounter "Enum" errors (e.g. `UserRole` mismatch), run this script to normalize all user roles in the database to UPPERCASE (ADMIN, USER, etc.).
```bash
python fix_user_roles_upper.py
```

### **4. View Raw User Data**
View the raw contents of the `users` table via SQLite (bypassing the application logic), useful for debugging if the main dashboard is down.
```bash
python check_raw_users.py
```

---

## Infrastructure

- The project uses **SQLite** by default for development (file: `backend/analytics.db`).
- It uses **SQLAlchemy** (Async) for ORM mapping.
- The project is ready for PostgreSQL migration by just updating the `DATABASE_URL` in `.env`.

