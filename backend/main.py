from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_db, close_db
from routes import workout, performance, dietician, habits, auth, chat
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="AI Gym & Fitness Assistant",
    description="Your personal AI-powered gym trainer",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://ai-gym-fitness.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(workout.router)
app.include_router(performance.router)
app.include_router(dietician.router)
app.include_router(habits.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "AI Gym & Fitness Assistant API v2.0 💪",
        "version": "2.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "db": "MongoDB connected"}