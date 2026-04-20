from fastapi import APIRouter
from pydantic import BaseModel
from datetime import date, timedelta
from collections import defaultdict
from database import habits_col, history_col

router = APIRouter(prefix="/habits", tags=["Habits"])

def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

class Habit(BaseModel):
    id: int
    name: str
    icon: str = "⭐"
    time: str = "Any Time"

class CheckIn(BaseModel):
    habit_id: int
    date: str
    done: bool

@router.get("")
async def get_habits():
    habits = await habits_col.find().to_list(100)
    return [fix_id(h) for h in habits]

@router.post("")
async def add_habit(habit: Habit):
    existing = await habits_col.find_one({"id": habit.id})
    if not existing:
        data = habit.dict()
        await habits_col.insert_one(data)
    return fix_id(habit.dict())

@router.delete("/{habit_id}")
async def delete_habit(habit_id: int):
    await habits_col.delete_one({"id": habit_id})
    return {"deleted": habit_id}

@router.post("/check")
async def check_in(item: CheckIn):
    if item.done:
        existing = await history_col.find_one({"date": item.date, "habit_id": item.habit_id})
        if not existing:
            await history_col.insert_one({"date": item.date, "habit_id": item.habit_id})
    else:
        await history_col.delete_one({"date": item.date, "habit_id": item.habit_id})
    return {"ok": True}

@router.get("/streak")
async def get_streak():
    all_history = await history_col.find().to_list(1000)
    all_habits = await habits_col.find().to_list(100)
    total_habits = len(all_habits)

    date_counts = defaultdict(set)
    for h in all_history:
        date_counts[h["date"]].add(h.get("habit_id"))

    completed_dates = []
    for d, habit_ids in date_counts.items():
        if total_habits == 0 or len(habit_ids) >= total_habits:
            completed_dates.append(d)

    history_dates = sorted(set(completed_dates))

    streak = 0
    today = date.today()
    d = today
    while str(d) in history_dates:
        streak += 1
        d -= timedelta(days=1)

    today_str = str(today)
    today_records = await history_col.find({"date": today_str}).to_list(100)
    checked_today = {str(r["habit_id"]): True for r in today_records}

    return {
        "streak": streak,
        "history": history_dates,
        "checked_today": checked_today
    }