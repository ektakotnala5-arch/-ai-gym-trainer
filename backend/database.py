from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "ai_gym_trainer"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
habits_col = db["habits"]
history_col = db["habit_history"]
workouts_col = db["workouts"]
diet_col = db["diet_plans"]
performance_col = db["performance"]
users_col = db["users"]

async def connect_db():
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

async def close_db():
    client.close()
    print("MongoDB connection closed")