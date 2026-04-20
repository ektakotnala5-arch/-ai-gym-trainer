from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from database import performance_col
from datetime import datetime

router = APIRouter(prefix="/performance", tags=["Performance"])

class PerformanceEntry(BaseModel):
    user_id: str = "default"
    exercise: str
    weight: float
    reps: int
    sets: int
    date: Optional[str] = None

def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

@router.post("/log")
async def log_performance(entry: PerformanceEntry):
    data = entry.dict()
    data["date"] = data["date"] or datetime.now().strftime("%Y-%m-%d")
    data["volume"] = entry.weight * entry.reps * entry.sets
    result = await performance_col.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data

@router.get("/history/{user_id}")
async def get_history(user_id: str = "default"):
    entries = await performance_col.find(
        {"user_id": user_id}
    ).sort("date", -1).to_list(100)
    return [fix_id(e) for e in entries]

@router.get("/stats/{user_id}")
async def get_stats(user_id: str = "default"):
    entries = await performance_col.find(
        {"user_id": user_id}
    ).to_list(1000)
    
    if not entries:
        return {"message": "No data yet", "total_sessions": 0}
    
    total_volume = sum(e.get("volume", 0) for e in entries)
    exercises = list(set(e["exercise"] for e in entries))
    
    return {
        "total_sessions": len(entries),
        "total_volume_kg": round(total_volume, 2),
        "exercises_tracked": exercises,
        "latest_entry": fix_id(entries[0]) if entries else None
    }

@router.get("/")
async def get_performance():
    return {"message": "Performance route working — log your lifts!"}