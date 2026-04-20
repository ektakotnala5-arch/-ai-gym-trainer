from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta
import json, os

router = APIRouter(prefix="/habits", tags=["Habits"])

DATA_FILE = "habits_data.json"

def load():
    if not os.path.exists(DATA_FILE):
        return {"habits": [], "history": []}
    with open(DATA_FILE) as f:
        return json.load(f)

def save(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

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
def get_habits():
    return load()["habits"]

@router.post("")
def add_habit(habit: Habit):
    data = load()
    data["habits"].append(habit.dict())
    save(data)
    return habit

@router.delete("/{habit_id}")
def delete_habit(habit_id: int):
    data = load()
    data["habits"] = [h for h in data["habits"] if h["id"] != habit_id]
    save(data)
    return {"deleted": habit_id}

@router.post("/check")
def check_in(item: CheckIn):
    data = load()
    if item.done and item.date not in data["history"]:
        # Only add to history if ALL habits are checked today
        data["history"].append(item.date)
    save(data)
    return {"ok": True}

@router.get("/streak")
def get_streak():
    data = load()
    history = sorted(set(data["history"]))
    streak = 0
    today = date.today()
    d = today
    while str(d) in history:
        streak += 1
        d -= timedelta(days=1)
    return {
        "streak": streak,
        "history": history,
        "checked_today": {}
    }