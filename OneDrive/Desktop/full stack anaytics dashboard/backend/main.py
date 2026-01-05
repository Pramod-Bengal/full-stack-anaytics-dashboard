from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Analytics Dashboard API",
    description="Backend for the Full-Stack Analytics Dashboard",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:4200",  # Angular default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import auth_routes, user_routes, analytics_routes
from database import init_db

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(analytics_routes.router)

@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/")
async def root():
    return {"message": "Welcome to the Analytics Dashboard API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
