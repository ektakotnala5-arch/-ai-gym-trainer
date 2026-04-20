from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/workout", tags=["Workout"])


class WorkoutRequest(BaseModel):
    fitness_level: str        # beginner / intermediate / advanced
    goal: str                 # lose_weight / gain_muscle / maintain
    days_per_week: int        # 3-6
    equipment: str            # gym / home / none
    age: Optional[int] = 25
    injuries: Optional[str] = ""


class WorkoutPlan(BaseModel):
    plan_name: str
    days_per_week: int
    goal: str
    fitness_level: str
    schedule: List[dict]
    warm_up: List[str]
    cool_down: List[str]
    tips: List[str]


# ── Full Exercise Database (matches your RepCounter exactly) ─────────
EXERCISE_DB = {

    # ── CHEST ────────────────────────────────────────────────────────
    "chest": [
        {"name": "bench_press",         "label": "Barbell Bench Press",      "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Chest",       "tips": "Keep shoulder blades retracted, feet flat on floor"},
        {"name": "incline_bench_press", "label": "Incline Bench Press",      "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Upper Chest", "tips": "30-45 degree incline, controlled descent"},
        {"name": "decline_bench_press", "label": "Decline Bench Press",      "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lower Chest", "tips": "Keep core tight, grip slightly wider than shoulder"},
        {"name": "pushup",              "label": "Push Up",                  "sets": 3, "reps": "15-20", "rest": "60s",  "muscle": "Chest",       "tips": "Full range of motion, body straight as a plank"},
        {"name": "wide_pushup",         "label": "Wide Push Up",             "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Outer Chest", "tips": "Hands wider than shoulder width"},
        {"name": "diamond_pushup",      "label": "Diamond Push Up",          "sets": 3, "reps": "10-15", "rest": "60s",  "muscle": "Inner Chest / Triceps", "tips": "Hands form a diamond shape under chest"},
        {"name": "incline_pushup",      "label": "Incline Push Up",          "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Lower Chest", "tips": "Hands elevated on bench or box"},
        {"name": "decline_pushup",      "label": "Decline Push Up",          "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Upper Chest", "tips": "Feet elevated on bench, hands on floor"},
        {"name": "chest_press",         "label": "Machine Chest Press",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Chest",       "tips": "Squeeze chest at peak, slow eccentric"},
        {"name": "incline_db_press",    "label": "Incline DB Press",         "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Upper Chest", "tips": "Dumbbells touch at top, don't lock out"},
        {"name": "decline_db_press",    "label": "Decline DB Press",         "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lower Chest", "tips": "Control descent, press explosively"},
        {"name": "chest_fly",           "label": "Dumbbell Chest Fly",       "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Chest",       "tips": "Slight bend in elbows, squeeze at top"},
        {"name": "incline_db_fly",      "label": "Incline DB Fly",           "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Upper Chest", "tips": "Keep slight elbow bend throughout"},
        {"name": "cable_crossover",     "label": "Cable Crossover",          "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Chest",       "tips": "Squeeze hard at peak contraction"},
        {"name": "high_cable_crossover","label": "High Cable Crossover",     "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lower Chest", "tips": "Pull cables down and across body"},
        {"name": "low_cable_crossover", "label": "Low Cable Crossover",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Upper Chest", "tips": "Pull cables up and across body"},
        {"name": "pec_deck",            "label": "Pec Deck Machine",         "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Chest",       "tips": "Don't let weight stack touch between reps"},
        {"name": "dips",                "label": "Chest Dips",               "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lower Chest / Triceps", "tips": "Lean forward to target chest"},
        {"name": "parallel_bar_dips",   "label": "Parallel Bar Dips",        "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Chest / Triceps", "tips": "Go below 90 degrees for full chest stretch"},
        {"name": "dips_behind_hips",    "label": "Bench Dips",               "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Triceps / Lower Chest", "tips": "Keep back close to bench"},
    ],

    # ── BACK ─────────────────────────────────────────────────────────
    "back": [
        {"name": "pullup",                  "label": "Pull Up",                  "sets": 4, "reps": "6-10",  "rest": "90s",  "muscle": "Lats",      "tips": "Full dead hang at bottom, chin over bar"},
        {"name": "chinup",                  "label": "Chin Up",                  "sets": 4, "reps": "6-10",  "rest": "90s",  "muscle": "Lats / Biceps", "tips": "Supinated grip, pull chest to bar"},
        {"name": "lat_pulldown",            "label": "Lat Pulldown",             "sets": 4, "reps": "10-12", "rest": "75s",  "muscle": "Lats",      "tips": "Lean slightly back, pull to upper chest"},
        {"name": "close_grip_lat_pulldown", "label": "Close Grip Lat Pulldown",  "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Mid Lats",  "tips": "Elbows close to body on the way down"},
        {"name": "reverse_lat_pulldown",    "label": "Reverse Grip Lat Pulldown","sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lats / Biceps", "tips": "Underhand grip, squeeze at bottom"},
        {"name": "straight_arm_pulldown",   "label": "Straight Arm Pulldown",    "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lats",      "tips": "Keep arms straight, hinge at shoulder"},
        {"name": "seated_cable_row",        "label": "Seated Cable Row",         "sets": 4, "reps": "10-12", "rest": "75s",  "muscle": "Mid Back",  "tips": "Keep chest tall, pull to lower ribs"},
        {"name": "low_pulley_row",          "label": "Low Pulley Row",           "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Mid Back",  "tips": "Full stretch at start of each rep"},
        {"name": "one_arm_db_row",          "label": "One Arm DB Row",           "sets": 4, "reps": "10-12", "rest": "75s",  "muscle": "Lats / Mid Back", "tips": "Pull elbow past torso, don't rotate"},
        {"name": "one_arm_cable_row",       "label": "One Arm Cable Row",        "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Mid Back",  "tips": "Brace core, pull with back not arm"},
        {"name": "bent_over_row",           "label": "Barbell Bent Over Row",    "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Full Back", "tips": "Hinge to 45 degrees, pull to lower chest"},
        {"name": "t_bar_row",               "label": "T-Bar Row",                "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Mid Back",  "tips": "Chest on pad, full ROM every rep"},
        {"name": "vertical_row",            "label": "Vertical Row",             "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lats",      "tips": "Pull body straight up, elbows flared"},
        {"name": "barbell_pullover",        "label": "Barbell Pullover",         "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lats / Chest", "tips": "Slight elbow bend, feel stretch at top"},
        {"name": "deadlift",                "label": "Deadlift",                 "sets": 4, "reps": "5-6",   "rest": "120s", "muscle": "Full Back / Legs", "tips": "Neutral spine always, drive through heels"},
        {"name": "romanian_deadlift",       "label": "Romanian Deadlift",        "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Hamstrings / Lower Back", "tips": "Push hips back, not down"},
        {"name": "sumo_deadlift",           "label": "Sumo Deadlift",            "sets": 4, "reps": "5-6",   "rest": "120s", "muscle": "Inner Legs / Back", "tips": "Toes pointed out, grip inside legs"},
        {"name": "back_hyperextension",     "label": "Back Hyperextension",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lower Back / Glutes", "tips": "Don't hyperextend at top"},
        {"name": "reverse_pec_fly",         "label": "Reverse Pec Fly",          "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Rear Delt / Upper Back", "tips": "Slight bend in elbows, lead with elbows"},
        {"name": "face_pull",               "label": "Face Pull",                "sets": 3, "reps": "15-20", "rest": "60s",  "muscle": "Rear Delt / Rotator Cuff", "tips": "Pull to nose level, elbows high"},
        {"name": "plate_shrug",             "label": "Plate Shrug",              "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Traps",     "tips": "Shrug straight up, no rolling"},
        {"name": "barbell_shrug",           "label": "Barbell Shrug",            "sets": 4, "reps": "12-15", "rest": "60s",  "muscle": "Traps",     "tips": "Hold at top for 1 second"},
        {"name": "db_shrug",                "label": "Dumbbell Shrug",           "sets": 4, "reps": "12-15", "rest": "60s",  "muscle": "Traps",     "tips": "Full range, squeeze at top"},
    ],

    # ── SHOULDERS ────────────────────────────────────────────────────
    "shoulders": [
        {"name": "shoulder_press",        "label": "Barbell Shoulder Press",   "sets": 4, "reps": "6-8",   "rest": "90s",  "muscle": "Front/Side Delt", "tips": "Press straight up, brace core"},
        {"name": "arnold_press",          "label": "Arnold Press",             "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Full Delt",       "tips": "Rotate through full range of motion"},
        {"name": "military_press",        "label": "Military Press",           "sets": 4, "reps": "6-8",   "rest": "90s",  "muscle": "Front Delt",      "tips": "Standing, strict form — no leg drive"},
        {"name": "db_shoulder_press",     "label": "DB Shoulder Press",        "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Full Delt",       "tips": "Don't lock elbows at top"},
        {"name": "machine_shoulder_press","label": "Machine Shoulder Press",   "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Front/Side Delt", "tips": "Adjust seat so handles are at shoulder height"},
        {"name": "lateral_raise",         "label": "Lateral Raise",            "sets": 4, "reps": "12-15", "rest": "60s",  "muscle": "Side Delt",       "tips": "Lead with elbows, not wrists"},
        {"name": "cable_lateral_raise",   "label": "Cable Lateral Raise",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Side Delt",       "tips": "Cross cable across body for constant tension"},
        {"name": "seated_lateral_raise",  "label": "Seated Lateral Raise",     "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Side Delt",       "tips": "Seat removes cheat — strict form"},
        {"name": "front_raise",           "label": "Front Raise",              "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Front Delt",      "tips": "Don't swing — slow controlled reps"},
        {"name": "db_front_raise",        "label": "DB Front Raise",           "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Front Delt",      "tips": "Alternating arms keeps tension constant"},
        {"name": "cable_front_raise",     "label": "Cable Front Raise",        "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Front Delt",      "tips": "Cable gives constant tension vs dumbbell"},
        {"name": "upright_row",           "label": "Upright Row",              "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Traps / Side Delt","tips": "Pull to chin, elbows above hands"},
        {"name": "cable_upright_row",     "label": "Cable Upright Row",        "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Traps / Side Delt","tips": "Constant tension throughout movement"},
        {"name": "rear_delt_fly",         "label": "Rear Delt Fly",            "sets": 3, "reps": "15-20", "rest": "60s",  "muscle": "Rear Delt",       "tips": "Hinge at hips, pinch shoulder blades"},
    ],

    # ── BICEPS ───────────────────────────────────────────────────────
    "biceps": [
        {"name": "bicep_curl",           "label": "Dumbbell Bicep Curl",      "sets": 4, "reps": "10-12", "rest": "60s",  "muscle": "Biceps",           "tips": "No swinging, strict form always"},
        {"name": "barbell_curl",         "label": "Barbell Curl",             "sets": 4, "reps": "8-10",  "rest": "75s",  "muscle": "Biceps",           "tips": "Keep elbows pinned to your sides"},
        {"name": "ez_bar_curl",          "label": "EZ Bar Curl",              "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Biceps",           "tips": "EZ bar reduces wrist strain"},
        {"name": "hammer_curl",          "label": "Hammer Curl",              "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Brachialis",       "tips": "Neutral grip, don't rotate wrist"},
        {"name": "concentration_curl",   "label": "Concentration Curl",       "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Biceps Peak",      "tips": "Elbow on inner thigh, full ROM"},
        {"name": "preacher_curl",        "label": "Preacher Curl",            "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Lower Biceps",     "tips": "Don't let arms snap at bottom"},
        {"name": "preacher_db_curl",     "label": "Preacher DB Curl",         "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Lower Biceps",     "tips": "One arm at a time for full focus"},
        {"name": "incline_db_curl",      "label": "Incline DB Curl",          "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Long Head Bicep",  "tips": "Full stretch at bottom — incredible for peak"},
        {"name": "cable_curl",           "label": "Cable Curl",               "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Biceps",           "tips": "Constant tension unlike dumbbells"},
        {"name": "standing_cable_curl",  "label": "Standing Cable Curl",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Biceps",           "tips": "Keep elbows at sides throughout"},
        {"name": "spider_curl",          "label": "Spider Curl",              "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Biceps Peak",      "tips": "Chest on incline bench, arms hang down"},
        {"name": "reverse_curl",         "label": "Reverse Curl",             "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Brachialis / Forearms", "tips": "Overhand grip, trains brachialis and forearms"},
        {"name": "21s_curl",             "label": "21s Curl",                 "sets": 3, "reps": "21",    "rest": "75s",  "muscle": "Full Biceps",      "tips": "7 lower half + 7 upper half + 7 full reps"},
    ],

    # ── TRICEPS ──────────────────────────────────────────────────────
    "triceps": [
        {"name": "skull_crusher",             "label": "Skull Crusher",              "sets": 4, "reps": "10-12", "rest": "75s",  "muscle": "Triceps",          "tips": "Keep elbows fixed, lower to forehead"},
        {"name": "overhead_tricep_extension", "label": "Overhead Tricep Extension",  "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Long Head Tricep", "tips": "Keep elbows close to head"},
        {"name": "tricep_pushdown",           "label": "Tricep Pushdown",            "sets": 4, "reps": "12-15", "rest": "60s",  "muscle": "Triceps",          "tips": "Lock elbows at sides, squeeze at bottom"},
        {"name": "rope_pushdown",             "label": "Rope Pushdown",              "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Triceps",          "tips": "Flare rope out at bottom for peak squeeze"},
        {"name": "v_bar_pushdown",            "label": "V-Bar Pushdown",             "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Triceps",          "tips": "Strict form, elbows glued to sides"},
        {"name": "reverse_grip_pushdown",     "label": "Reverse Grip Pushdown",      "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lateral Tricep",   "tips": "Underhand grip changes muscle activation"},
        {"name": "one_arm_pushdown",          "label": "One Arm Pushdown",           "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Triceps",          "tips": "Great for fixing left-right imbalances"},
        {"name": "tricep_dip",                "label": "Tricep Dip",                 "sets": 3, "reps": "10-15", "rest": "75s",  "muscle": "Triceps",          "tips": "Keep body upright to target triceps"},
        {"name": "cable_kickback",            "label": "Cable Kickback",             "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lateral Tricep",   "tips": "Hinge forward, extend arm fully behind"},
        {"name": "oh_cable_extension",        "label": "Overhead Cable Extension",   "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Long Head Tricep", "tips": "Face away from cable, hands behind head"},
        {"name": "close_grip_bench",          "label": "Close Grip Bench Press",     "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Triceps / Inner Chest", "tips": "Grip just inside shoulder width"},
        {"name": "tricep_extension",          "label": "DB Tricep Extension",        "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Triceps",          "tips": "Keep upper arm still throughout"},
    ],

    # ── LEGS ─────────────────────────────────────────────────────────
    "legs": [
        {"name": "barbell_squat",      "label": "Barbell Squat",           "sets": 4, "reps": "6-8",   "rest": "120s", "muscle": "Quads / Glutes",     "tips": "Break parallel, knees track toes"},
        {"name": "front_squat",        "label": "Front Squat",             "sets": 4, "reps": "6-8",   "rest": "120s", "muscle": "Quads",              "tips": "Elbows high, more upright torso"},
        {"name": "sumo_squat",         "label": "Sumo Squat",              "sets": 3, "reps": "10-12", "rest": "75s",  "muscle": "Inner Quads / Glutes","tips": "Wide stance, toes pointed out 45°"},
        {"name": "goblet_squat",       "label": "Goblet Squat",            "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Quads / Core",       "tips": "Hold dumbbell at chest, elbows inside knees"},
        {"name": "hack_squat",         "label": "Hack Squat",              "sets": 3, "reps": "10-12", "rest": "90s",  "muscle": "Quads",              "tips": "Feet low on platform for quad focus"},
        {"name": "jump_squat",         "label": "Jump Squat",              "sets": 3, "reps": "10-15", "rest": "60s",  "muscle": "Quads / Power",      "tips": "Land softly, absorb force through knees"},
        {"name": "pistol_squat",       "label": "Pistol Squat",            "sets": 3, "reps": "5-8",   "rest": "75s",  "muscle": "Quads / Balance",    "tips": "Use TRX to assist if needed"},
        {"name": "lunge",              "label": "Dumbbell Lunge",          "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Quads / Glutes",     "tips": "Keep front knee behind toes"},
        {"name": "walking_lunge",      "label": "Walking Lunge",           "sets": 3, "reps": "12 each","rest": "60s", "muscle": "Quads / Glutes",     "tips": "Big steps, drive back knee toward floor"},
        {"name": "reverse_lunge",      "label": "Reverse Lunge",           "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Glutes / Quads",     "tips": "Step back, lower rear knee to floor"},
        {"name": "lateral_lunge",      "label": "Lateral Lunge",           "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Inner Thigh / Glutes","tips": "Push hips back and to the side"},
        {"name": "leg_press",          "label": "Leg Press",               "sets": 4, "reps": "10-12", "rest": "90s",  "muscle": "Quads",              "tips": "Don't lock out knees at top"},
        {"name": "leg_extension",      "label": "Leg Extension",           "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Quads",              "tips": "Hold at top for 1 second squeeze"},
        {"name": "leg_curl",           "label": "Lying Leg Curl",          "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Hamstrings",         "tips": "Control the eccentric — 3 second descent"},
        {"name": "seated_leg_curl",    "label": "Seated Leg Curl",         "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Hamstrings",         "tips": "Full extension at start of each rep"},
        {"name": "romanian_deadlift",  "label": "Romanian Deadlift",       "sets": 4, "reps": "8-10",  "rest": "90s",  "muscle": "Hamstrings / Glutes","tips": "Push hips back, bar stays close to legs"},
        {"name": "hip_thrust",         "label": "Hip Thrust",              "sets": 4, "reps": "10-12", "rest": "75s",  "muscle": "Glutes",             "tips": "Chin to chest, full hip extension at top"},
        {"name": "glute_bridge",       "label": "Glute Bridge",            "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Glutes",             "tips": "Squeeze glutes hard at the top"},
        {"name": "donkey_kick",        "label": "Donkey Kick",             "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Glutes",             "tips": "Keep hips square to floor"},
        {"name": "step_up",            "label": "Box Step Up",             "sets": 3, "reps": "10-12", "rest": "60s",  "muscle": "Quads / Glutes",     "tips": "Drive through heel of the elevated foot"},
        {"name": "box_jump",           "label": "Box Jump",                "sets": 4, "reps": "5-8",   "rest": "90s",  "muscle": "Explosive Power",    "tips": "Land soft, step down — don't jump down"},
        {"name": "calf_raise",         "label": "Standing Calf Raise",     "sets": 4, "reps": "15-20", "rest": "45s",  "muscle": "Calves",             "tips": "Full stretch at bottom every rep"},
        {"name": "seated_calf_raise",  "label": "Seated Calf Raise",       "sets": 4, "reps": "15-20", "rest": "45s",  "muscle": "Soleus",             "tips": "Bent knee targets soleus, not gastrocnemius"},
        {"name": "standing_calf_raise","label": "Single Leg Calf Raise",   "sets": 3, "reps": "12-15", "rest": "45s",  "muscle": "Calves",             "tips": "Hold dumbbell for added resistance"},
    ],

    # ── CORE ─────────────────────────────────────────────────────────
    "core": [
        {"name": "plank",              "label": "Plank",                   "sets": 3, "reps": "45-60s","rest": "45s",  "muscle": "Full Core",          "tips": "Straight line head to heel, breathe normally"},
        {"name": "side_plank",         "label": "Side Plank",              "sets": 3, "reps": "30-45s","rest": "45s",  "muscle": "Obliques",           "tips": "Hips up, body in straight line"},
        {"name": "crunch",             "label": "Crunch",                  "sets": 3, "reps": "20-25", "rest": "45s",  "muscle": "Upper Abs",          "tips": "Exhale on way up, hands behind ears"},
        {"name": "situp",              "label": "Sit Up",                  "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Full Abs",           "tips": "Control descent — don't flop down"},
        {"name": "v_up",               "label": "V Up",                    "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Full Abs",           "tips": "Meet hands and feet at the top"},
        {"name": "cable_crunch",       "label": "Cable Crunch",            "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Abs",                "tips": "Round spine fully — hips stay still"},
        {"name": "ab_bench_crunch",    "label": "Ab Bench Crunch",         "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Upper Abs",          "tips": "Feet hooked under pad, full crunch"},
        {"name": "leg_raise",          "label": "Leg Raise",               "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lower Abs",          "tips": "Don't swing — lower legs slowly"},
        {"name": "hanging_leg_raise",  "label": "Hanging Leg Raise",       "sets": 3, "reps": "10-15", "rest": "60s",  "muscle": "Lower Abs",          "tips": "Control the swing, legs straight"},
        {"name": "vertical_knee_up",   "label": "Vertical Knee Up",        "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Lower Abs",          "tips": "Arms on pads, drive knees to chest"},
        {"name": "mountain_climber",   "label": "Mountain Climber",        "sets": 3, "reps": "20-30", "rest": "45s",  "muscle": "Core / Cardio",      "tips": "Hips low, drive knees alternately"},
        {"name": "bicycle_crunch",     "label": "Bicycle Crunch",          "sets": 3, "reps": "20-30", "rest": "45s",  "muscle": "Obliques / Abs",     "tips": "Elbow to opposite knee, rotate fully"},
        {"name": "russian_twist",      "label": "Russian Twist",           "sets": 3, "reps": "20 total","rest": "45s","muscle": "Obliques",           "tips": "Keep feet elevated for extra challenge"},
        {"name": "flutter_kick",       "label": "Flutter Kick",            "sets": 3, "reps": "30s",   "rest": "30s",  "muscle": "Lower Abs",          "tips": "Small rapid kicks, lower back pressed down"},
        {"name": "toe_touch",          "label": "Toe Touch",               "sets": 3, "reps": "15-20", "rest": "45s",  "muscle": "Upper Abs",          "tips": "Legs vertical, reach fingertips to toes"},
        {"name": "wood_chop",          "label": "Wood Chop",               "sets": 3, "reps": "12-15", "rest": "60s",  "muscle": "Obliques / Core",    "tips": "Rotate from core, not just arms"},
        {"name": "dead_bug",           "label": "Dead Bug",                "sets": 3, "reps": "10-12", "rest": "45s",  "muscle": "Deep Core",          "tips": "Lower back pressed to floor always"},
    ],

    # ── CARDIO ───────────────────────────────────────────────────────
    "cardio": [
        {"name": "burpee",             "label": "Burpee",                  "sets": 4, "reps": "10-15", "rest": "60s",  "muscle": "Full Body / Cardio", "tips": "Jump at top, chest to floor at bottom"},
        {"name": "jumping_jack",       "label": "Jumping Jack",            "sets": 3, "reps": "30-50", "rest": "30s",  "muscle": "Cardio",             "tips": "Full arm extension overhead"},
        {"name": "high_knees",         "label": "High Knees",              "sets": 4, "reps": "30s",   "rest": "30s",  "muscle": "Cardio / Legs",      "tips": "Drive knees to hip height, pump arms"},
        {"name": "skipping",           "label": "Jump Rope",               "sets": 5, "reps": "3 min", "rest": "60s",  "muscle": "Cardio",             "tips": "Stay on balls of feet, wrists do the work"},
        {"name": "running_in_place",   "label": "Running in Place",        "sets": 3, "reps": "60s",   "rest": "30s",  "muscle": "Cardio",             "tips": "Full arm drive, land midfoot"},
        {"name": "butt_kicks",         "label": "Butt Kicks",              "sets": 3, "reps": "30s",   "rest": "30s",  "muscle": "Hamstrings / Cardio","tips": "Kick heels to glutes, stay on toes"},
        {"name": "lateral_shuffle",    "label": "Lateral Shuffle",         "sets": 3, "reps": "30s",   "rest": "45s",  "muscle": "Cardio / Agility",   "tips": "Stay low in athletic stance throughout"},
        {"name": "speed_skater",       "label": "Speed Skater",            "sets": 3, "reps": "20-30", "rest": "45s",  "muscle": "Glutes / Cardio",    "tips": "Bound laterally, touch floor with hand"},
    ],

    # ── SENIOR / BEGINNER ────────────────────────────────────────────
    "beginner": [
        {"name": "standing_march",     "label": "Standing March",          "sets": 2, "reps": "20-30", "rest": "30s",  "muscle": "Core / Balance",     "tips": "Hold chair if needed for balance"},
        {"name": "toe_tap",            "label": "Toe Tap",                 "sets": 2, "reps": "20",    "rest": "30s",  "muscle": "Lower Body / Balance","tips": "Tap toe to step in front, alternate legs"},
        {"name": "seated_leg_raise",   "label": "Seated Leg Raise",        "sets": 2, "reps": "12-15", "rest": "30s",  "muscle": "Quads / Core",       "tips": "Sit tall, raise leg parallel to floor"},
        {"name": "arm_circle",         "label": "Arm Circle",              "sets": 2, "reps": "20 each","rest": "30s", "muscle": "Shoulders",          "tips": "Small circles → big circles, both directions"},
        {"name": "shoulder_roll",      "label": "Shoulder Roll",           "sets": 2, "reps": "10 each","rest": "30s", "muscle": "Shoulders / Neck",   "tips": "Roll forward then backward"},
        {"name": "ankle_rotation",     "label": "Ankle Rotation",          "sets": 2, "reps": "10 each","rest": "30s", "muscle": "Ankles",             "tips": "Seated or standing, full circles"},
        {"name": "heel_toe_walk",      "label": "Heel Toe Walk",           "sets": 2, "reps": "20 steps","rest":"30s", "muscle": "Balance / Calves",   "tips": "Walk in straight line, heel to toe"},
        {"name": "chair_squat",        "label": "Chair Squat",             "sets": 2, "reps": "10-12", "rest": "45s",  "muscle": "Quads / Glutes",     "tips": "Hover above chair — don't fully sit"},
        {"name": "wall_sit",           "label": "Wall Sit",                "sets": 2, "reps": "20-30s","rest": "45s",  "muscle": "Quads",              "tips": "90 degree angle at knees, back flat on wall"},
    ],

    # ── YOGA / STRETCHING ────────────────────────────────────────────
    "yoga": [
        {"name": "warrior_pose",           "label": "Warrior Pose",           "sets": 2, "reps": "30s each","rest": "15s","muscle": "Legs / Balance",     "tips": "Front knee over ankle, gaze forward"},
        {"name": "downward_dog",           "label": "Downward Dog",           "sets": 3, "reps": "30s",   "rest": "15s",  "muscle": "Hamstrings / Back",  "tips": "Press heels toward floor, straight spine"},
        {"name": "tree_pose",              "label": "Tree Pose",              "sets": 2, "reps": "30s each","rest": "15s","muscle": "Balance / Core",     "tips": "Fix gaze on a still point for balance"},
        {"name": "cobra_pose",             "label": "Cobra Pose",             "sets": 3, "reps": "20-30s","rest": "15s",  "muscle": "Spine / Core",       "tips": "Elbows slightly bent, shoulders down"},
        {"name": "child_pose",             "label": "Child Pose",             "sets": 2, "reps": "45-60s","rest": "—",    "muscle": "Back / Hips",        "tips": "Arms extended or by sides, breathe deep"},
        {"name": "cat_cow",                "label": "Cat-Cow Stretch",        "sets": 2, "reps": "10",    "rest": "—",    "muscle": "Spine Mobility",     "tips": "Inhale on cow, exhale on cat"},
        {"name": "bridge_pose",            "label": "Bridge Pose",            "sets": 3, "reps": "20-30s","rest": "30s",  "muscle": "Glutes / Spine",     "tips": "Squeeze glutes at the top"},
        {"name": "pigeon_pose",            "label": "Pigeon Pose",            "sets": 2, "reps": "45s each","rest": "15s","muscle": "Hip Flexors",        "tips": "Hold and breathe — don't rush"},
        {"name": "seated_forward_bend",    "label": "Seated Forward Bend",   "sets": 2, "reps": "30-45s","rest": "—",    "muscle": "Hamstrings / Back",  "tips": "Hinge at hips, don't round spine"},
        {"name": "standing_forward_bend",  "label": "Standing Forward Bend", "sets": 2, "reps": "30s",   "rest": "—",    "muscle": "Hamstrings",         "tips": "Soft bend in knees, let head hang"},
    ],
}

# ── Schedule Templates ───────────────────────────────────────────────
SCHEDULES = {
    3: {
        "lose_weight":  [["chest","core","cardio"],    ["back","legs"],          ["shoulders","biceps","cardio"]],
        "gain_muscle":  [["chest","triceps"],           ["back","biceps"],         ["legs","shoulders"]],
        "maintain":     [["chest","back"],              ["legs","core"],           ["shoulders","biceps","triceps"]],
    },
    4: {
        "lose_weight":  [["chest","core"],    ["legs","cardio"],  ["back","shoulders"],  ["biceps","triceps","cardio"]],
        "gain_muscle":  [["chest","triceps"], ["back","biceps"],  ["legs"],              ["shoulders","core"]],
        "maintain":     [["chest","back"],    ["legs","core"],    ["shoulders","biceps"],["triceps","cardio"]],
    },
    5: {
        "lose_weight":  [["chest"],["back","cardio"],["legs"],["shoulders","biceps"],["core","cardio"]],
        "gain_muscle":  [["chest","triceps"],["back","biceps"],["legs"],["shoulders"],["arms","core"]],
        "maintain":     [["chest","back"],["legs"],["shoulders","biceps"],["triceps","core"],["cardio"]],
    },
    6: {
        "lose_weight":  [["chest","core"],["back","cardio"],["legs"],["shoulders","biceps"],["triceps","cardio"],["legs","core"]],
        "gain_muscle":  [["chest","triceps"],["back","biceps"],["legs"],["shoulders"],["biceps","triceps"],["legs","core"]],
        "maintain":     [["chest","back"],["legs"],["shoulders","biceps"],["triceps","core"],["chest","back"],["legs","cardio"]],
    },
}

DAY_NAMES   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
MUSCLE_ICONS = {
    "chest":"💪","back":"🏋️","legs":"🦵","shoulders":"🔝",
    "biceps":"💪","triceps":"💪","core":"🎯","cardio":"🏃",
    "yoga":"🧘","beginner":"🌱","arms":"💪",
}

EQUIPMENT_FILTER = {
    "home": ["pushup","wide_pushup","diamond_pushup","incline_pushup","decline_pushup",
             "dips_behind_hips","pullup","chinup","lunge","walking_lunge","reverse_lunge",
             "lateral_lunge","squat","jump_squat","goblet_squat","glute_bridge","hip_thrust",
             "donkey_kick","step_up","box_jump","calf_raise","standing_calf_raise",
             "plank","side_plank","crunch","situp","v_up","leg_raise","mountain_climber",
             "bicycle_crunch","russian_twist","flutter_kick","toe_touch","dead_bug",
             "burpee","jumping_jack","high_knees","running_in_place","butt_kicks",
             "lateral_shuffle","speed_skater","hammer_curl","bicep_curl","tricep_dip"],
    "none": ["pushup","wide_pushup","diamond_pushup","incline_pushup",
             "squat","lunge","walking_lunge","glute_bridge","donkey_kick","calf_raise",
             "plank","side_plank","crunch","situp","mountain_climber","bicycle_crunch",
             "russian_twist","flutter_kick","burpee","jumping_jack","high_knees",
             "running_in_place","butt_kicks"],
}


def filter_by_equipment(exercises: list, equipment: str) -> list:
    if equipment == "gym":
        return exercises
    allowed = EQUIPMENT_FILTER.get(equipment, [])
    return [e for e in exercises if e["name"] in allowed] or exercises


def pick_exercises(muscle_group: str, fitness_level: str, equipment: str, multi: bool) -> list:
    pool = EXERCISE_DB.get(muscle_group, EXERCISE_DB.get("core", []))
    pool = filter_by_equipment(pool, equipment)
    count = 3 if multi else 5
    if fitness_level == "beginner":
        count = min(count, 3)
    selected = pool[:count]
    result = []
    for ex in selected:
        e = dict(ex)
        if fitness_level == "beginner":
            e["sets"] = max(2, e["sets"] - 1)
            e["rest"] = str(int(e["rest"].replace("s","")) + 15) + "s" if "s" in e["rest"] else e["rest"]
        elif fitness_level == "advanced":
            e["sets"] = e["sets"] + 1
        result.append(e)
    return result


def build_schedule(request: WorkoutRequest) -> list:
    days  = min(max(request.days_per_week, 3), 6)
    goal  = request.goal if request.goal in SCHEDULES[days] else "maintain"
    plan  = SCHEDULES[days][goal]
    schedule = []
    for i, muscle_groups in enumerate(plan):
        exercises = []
        for mg in muscle_groups:
            exercises += pick_exercises(mg, request.fitness_level, request.equipment, len(muscle_groups) > 1)
        icon  = MUSCLE_ICONS.get(muscle_groups[0], "🏋️")
        label = " + ".join(g.title() for g in muscle_groups)
        schedule.append({
            "day":           DAY_NAMES[i],
            "focus":         label,
            "icon":          icon,
            "exercises":     exercises,
            "total_sets":    sum(e["sets"] for e in exercises),
            "est_duration":  f"{len(exercises) * 8 + 10} min",
        })
    return schedule


# ── Routes ───────────────────────────────────────────────────────────
@router.post("/plan", response_model=WorkoutPlan)
def get_workout_plan(request: WorkoutRequest):
    schedule = build_schedule(request)

    plan_names = {
        "lose_weight": "Fat Burning Shred Program",
        "gain_muscle": "Hypertrophy Mass Builder",
        "maintain":    "Athletic Performance Plan",
    }
    tips_map = {
        "lose_weight": [
            "Keep rest under 60s to keep heart rate elevated",
            "Add 20-30 min steady state cardio after every session",
            "Eat 300-500 calories below TDEE for optimal fat loss",
            "Track your workouts — progressive overload still matters in a cut",
            "Sleep 7-8 hours — cortisol from poor sleep kills fat loss",
        ],
        "gain_muscle": [
            "Progressive overload every session — add weight or reps weekly",
            "Eat 200-300 calories above TDEE with 1.8-2.2g protein per kg",
            "Rest 90-120s between heavy compound sets",
            "Train each muscle 2x per week for maximum hypertrophy",
            "Take creatine monohydrate 5g daily — most proven supplement",
        ],
        "maintain": [
            "Consistency beats intensity — show up every scheduled day",
            "Mix strength and cardio to maintain all fitness qualities",
            "Eat at maintenance with 1.4-1.6g protein per kg bodyweight",
            "Deload every 6-8 weeks — reduce volume 40% for full recovery",
            "Track key lifts monthly to ensure you're not regressing",
        ],
    }

    return WorkoutPlan(
        plan_name=plan_names.get(request.goal, "Custom Fitness Plan"),
        days_per_week=request.days_per_week,
        goal=request.goal,
        fitness_level=request.fitness_level,
        schedule=schedule,
        warm_up=[
            "5 min light cardio (treadmill or bike)",
            "Arm circles 30 seconds each direction",
            "Hip circles and leg swings 30 seconds",
            "Band pull-aparts 2x15",
            "Bodyweight squats 2x10",
        ],
        cool_down=[
            "5 min slow walk on treadmill",
            "Chest doorway stretch 30s x2",
            "Seated hamstring stretch 30s each leg",
            "Child's pose 60 seconds",
            "Shoulder cross-body stretch 30s each",
            "Deep breathing — 5 slow breaths",
        ],
        tips=tips_map.get(request.goal, tips_map["maintain"]),
    )


@router.get("/exercises/{muscle}")
def get_exercises(muscle: str):
    key = muscle.lower()
    if key in EXERCISE_DB:
        return {"muscle": muscle, "count": len(EXERCISE_DB[key]), "exercises": EXERCISE_DB[key]}
    return {"error": f"'{muscle}' not found. Available: {list(EXERCISE_DB.keys())}"}


@router.get("/muscles")
def list_muscles():
    return {
        "available": list(EXERCISE_DB.keys()),
        "total_exercises": sum(len(v) for v in EXERCISE_DB.values())
    }


@router.get("/exercise/{name}")
def get_single_exercise(name: str):
    key = name.lower().replace(" ", "_")
    for group, exercises in EXERCISE_DB.items():
        for ex in exercises:
            if ex["name"] == key:
                return {"group": group, **ex}
    return {"error": f"Exercise '{name}' not found"}