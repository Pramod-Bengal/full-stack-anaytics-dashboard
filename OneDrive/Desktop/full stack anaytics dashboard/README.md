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

- The project includes a `docker-compose.yml` for supporting services (like PostgreSQL, though the current backend uses MongoDB).
