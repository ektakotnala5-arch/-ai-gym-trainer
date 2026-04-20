from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import random

router = APIRouter(prefix="/score", tags=["Performance Scorer"])

class WorkoutData(BaseModel):
    exercise: str
    total_reps: int
    duration_minutes: int
    form_errors: int
    target_reps: int

class ScoreResult(BaseModel):
    total_score: int
    grade: str
    rep_score: int
    form_score: int
    duration_score: int
    feedback: List[str]
    badges: List[str]
    roast: str

GENZ_FIRE = [
    "bro said 'rest day' and meant every day 💀",
    "you ate that workout NO CRUMBS LEFT 🔥",
    "not me crying at your gains rn 😭🔥",
    "slay era unlocked bestie 💅",
    "the gym called, it misses you bestie 📞",
    "you're built different fr fr 🏋️",
    "okay PERIODT the gains are real 💪",
    "main character energy activated ✨",
    "understood the assignment and ATE IT 🍽️",
    "no cap this workout was elite 🎯",
]

GENZ_MID = [
    "it's giving... effort. we respect the grind 💀",
    "mid but make it cute 😭",
    "babe wake up new workout just dropped 📲",
    "the potential is there ngl 👀",
    "slaying? not yet. but the era is coming 💅",
    "we don't gatekeep gains here, keep pushing 🔥",
    "the villain arc is almost over bestie 😤",
    "understood some of the assignment 📝",
    "it's giving starter pack energy, glow up incoming ✨",
    "not bad not great, we call that character development 📈",
]

GENZ_BAD = [
    "bestie the gym is NOT the place to be a quitter 💀",
    "this ain't it chief, but we still love you 😭",
    "bro really said 'I tried' and called it a day 💀",
    "the audacity to give up? we don't do that here 😤",
    "it's giving participation trophy energy 🏆",
    "main character said 'nah' today huh 😭",
    "the flop era ends NOW bestie 💪",
    "respectfully... try harder tomorrow 🙏",
    "not the villain arc we deserved 💀",
    "okay so we're in our lazy era? that's illegal 🚨",
]

def calculate_grade(score):
    if score >= 90: return "S+"
    elif score >= 80: return "A"
    elif score >= 70: return "B"
    elif score >= 60: return "C"
    elif score >= 50: return "D"
    return "F"

@router.post("/calculate", response_model=ScoreResult)
def calculate_score(data: WorkoutData):
    feedback = []
    badges = []

    # Rep Score (40 points)
    rep_ratio = min(data.total_reps / max(data.target_reps, 1), 1.5)
    rep_score = int(min(rep_ratio * 40, 40))

    if data.total_reps >= data.target_reps * 1.2:
        feedback.append("🔥 You went BEYOND the target? you're built different fr")
        badges.append("👑 Overachiever")
    elif data.total_reps >= data.target_reps:
        feedback.append("✅ Target reps LOCKED IN no cap 🎯")
        badges.append("🎯 Target Crusher")
    elif data.total_reps >= data.target_reps * 0.8:
        feedback.append("👀 Almost there bestie, like 2-3 more reps and you cooked")
    else:
        feedback.append(f"💀 bro left {data.target_reps - data.total_reps} reps on the table, that's not the vibe")

    # Form Score (40 points)
    form_score = max(40 - (data.form_errors * 8), 0)

    if data.form_errors == 0:
        feedback.append("💎 Zero form errors? you're literally a gym god rn")
        badges.append("💎 Perfect Form")
    elif data.form_errors <= 2:
        feedback.append("👍 Form was mostly clean, minor tweaks and you're elite")
    elif data.form_errors <= 4:
        feedback.append("😬 Form was giving questionable energy, fix that ASAP bestie")
    else:
        feedback.append("🚨 Form errors are NOT the vibe, quality over quantity period")

    # Duration Score (20 points)
    if data.duration_minutes >= 60:
        duration_score = 20
        feedback.append("⏱️ 60+ mins?? you're literally an endurance machine no cap")
        badges.append("⚡ Endurance Beast")
    elif data.duration_minutes >= 45:
        duration_score = 18
        feedback.append("💪 45 mins of pure grind, that's the main character energy")
        badges.append("🔥 Consistent Grinder")
    elif data.duration_minutes >= 30:
        duration_score = 14
        feedback.append("👌 30 mins is solid, but we know you can do more bestie")
    elif data.duration_minutes >= 15:
        duration_score = 8
        feedback.append("😅 15 mins? babe that's a warm up not a workout 💀")
    else:
        duration_score = 3
        feedback.append("💀 under 15 mins?? the audacity bestie, we need to talk")

    total_score = rep_score + form_score + duration_score
    grade = calculate_grade(total_score)

    # Elite badges
    if total_score >= 90:
        badges.append("🏆 S-Tier Athlete")
        badges.append("👑 Gym Royalty")
    elif total_score >= 80:
        badges.append("⭐ Elite Performance")
    elif total_score >= 70:
        badges.append("📈 Rising Star")

    # Gen Z roast/hype
    if total_score >= 80:
        roast = random.choice(GENZ_FIRE)
    elif total_score >= 55:
        roast = random.choice(GENZ_MID)
    else:
        roast = random.choice(GENZ_BAD)

    return ScoreResult(
        total_score=total_score,
        grade=grade,
        rep_score=rep_score,
        form_score=form_score,
        duration_score=duration_score,
        feedback=feedback,
        badges=badges,
        roast=roast
    )