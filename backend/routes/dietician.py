from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/diet", tags=["Dietician"])


class UserProfile(BaseModel):
    age: int
    weight: float
    height: float
    gender: str
    goal: str
    activity: str
    dietary_pref: str
    lifestyle: str = "general"
    allergies: List[str] = []


class DietPlan(BaseModel):
    bmi: float
    bmi_category: str
    daily_calories: int
    protein_g: int
    carbs_g: int
    fats_g: int
    fiber_g: int
    meals: List[dict]
    grocery_list: List[str]
    tips: List[str]
    diet_type: str
    water_intake_litres: float
    meal_timing: str
    age_group: str
    allergy_note: str


def calculate_bmi(weight, height):
    h = height / 100
    bmi = round(weight / (h * h), 1)
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    return bmi, category


def get_age_group(age):
    if age < 13:
        return "child"
    elif age < 18:
        return "teen"
    elif age < 60:
        return "adult"
    else:
        return "senior"


def calculate_calories(profile: UserProfile):
    age_group = get_age_group(profile.age)

    if profile.gender == "male":
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    else:
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161

    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    tdee = bmr * multipliers.get(profile.activity, 1.55)

    if age_group == "teen":
        tdee += 200
    elif age_group == "senior":
        tdee -= 100

    if profile.goal == "lose_weight":
        deficit = 300 if age_group == "senior" else 500
        return int(tdee - deficit)
    elif profile.goal == "gain_muscle":
        surplus = 200 if age_group == "senior" else 300
        return int(tdee + surplus)
    return int(tdee)


def filter_allergies(items, allergies):
    allergen_map = {
        "gluten": ["wheat", "bread", "roti", "oats", "barley", "seitan", "upma", "poha", "paratha", "toast"],
        "dairy": ["milk", "paneer", "curd", "yogurt", "cheese", "butter", "whey", "casein", "ghee", "buttermilk"],
        "nuts": ["almond", "walnut", "cashew", "peanut", "pistachio", "nut"],
        "eggs": ["egg"],
        "soy": ["soya", "tofu", "soy"],
        "shellfish": ["prawn", "shrimp", "crab", "lobster"],
        "fish": ["fish", "salmon", "tuna", "rohu", "mackerel"],
    }
    banned = set()
    for allergy in allergies:
        if allergy in allergen_map:
            banned.update(allergen_map[allergy])
    filtered = []
    for item in items:
        item_lower = item.lower()
        if not any(b in item_lower for b in banned):
            filtered.append(item)
    return filtered


def generate_meals(dietary_pref, goal, age_group, allergies):
    is_veg = dietary_pref in ["vegetarian", "vegan"]
    is_vegan = dietary_pref == "vegan"

    veg_lose_adult = [
        {"time": "6:30 AM", "meal": "Early Morning", "name": "Warm lemon water + 5 soaked almonds + 2 walnuts", "calories": 70, "protein": 2},
        {"time": "8:30 AM", "meal": "Breakfast", "name": "Moong dal chilla x2 with mint chutney + green tea", "calories": 280, "protein": 14},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "1 medium apple + 10 walnuts", "calories": 160, "protein": 3},
        {"time": "1:30 PM", "meal": "Lunch", "name": "Brown rice + dal tadka + mixed sabzi + salad + low fat curd", "calories": 480, "protein": 18},
        {"time": "4:00 PM", "meal": "Evening Snack", "name": "Sprouts chaat with lemon and spices + herbal tea", "calories": 150, "protein": 8},
        {"time": "7:00 PM", "meal": "Pre Workout", "name": "1 banana + black coffee", "calories": 100, "protein": 1},
        {"time": "9:00 PM", "meal": "Dinner", "name": "Palak soup + 2 multigrain roti + paneer bhurji (low fat)", "calories": 380, "protein": 20},
    ]

    veg_lose_senior = [
        {"time": "7:00 AM", "meal": "Early Morning", "name": "Warm water with honey and lemon", "calories": 30, "protein": 0},
        {"time": "8:30 AM", "meal": "Breakfast", "name": "Soft vegetable idli x3 with sambar (low oil)", "calories": 240, "protein": 10},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "Warm milk with turmeric OR fruit bowl", "calories": 120, "protein": 4},
        {"time": "1:00 PM", "meal": "Lunch", "name": "Soft khichdi with ghee + low fat curd + steamed vegetables", "calories": 380, "protein": 14},
        {"time": "4:00 PM", "meal": "Evening Snack", "name": "Roasted makhana + herbal tea + 5 soaked almonds", "calories": 130, "protein": 5},
        {"time": "7:30 PM", "meal": "Dinner", "name": "Moong dal soup + 2 soft roti + boiled vegetables", "calories": 340, "protein": 16},
    ]

    veg_lose_teen = [
        {"time": "7:00 AM", "meal": "Early Morning", "name": "Warm lemon water + 5 almonds", "calories": 60, "protein": 2},
        {"time": "8:00 AM", "meal": "Breakfast", "name": "Besan chilla x2 + low fat paneer + green tea", "calories": 320, "protein": 18},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "Banana + peanut butter (1 tbsp)", "calories": 180, "protein": 5},
        {"time": "1:30 PM", "meal": "Lunch", "name": "Dal rice + sabzi + salad + curd", "calories": 480, "protein": 18},
        {"time": "4:30 PM", "meal": "Evening Snack", "name": "Roasted chana + seasonal fruit", "calories": 200, "protein": 8},
        {"time": "8:00 PM", "meal": "Dinner", "name": "2 roti + paneer + soup + salad", "calories": 420, "protein": 22},
    ]

    veg_gain_adult = [
        {"time": "6:00 AM", "meal": "Early Morning", "name": "Mass gainer shake (if used) + 10 soaked almonds + 3 dates", "calories": 420, "protein": 25},
        {"time": "8:30 AM", "meal": "Breakfast", "name": "Paneer paratha x2 + full fat curd + glass of whole milk", "calories": 580, "protein": 30},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "Peanut butter banana smoothie with milk + handful mixed nuts", "calories": 380, "protein": 16},
        {"time": "1:30 PM", "meal": "Lunch", "name": "Rajma chawal + 2 roti + curd + mixed salad", "calories": 680, "protein": 30},
        {"time": "4:00 PM", "meal": "Pre Workout", "name": "Oats with full fat milk + 2 bananas + honey", "calories": 420, "protein": 14},
        {"time": "6:30 PM", "meal": "Post Workout", "name": "Whey protein shake with milk + 1 banana", "calories": 280, "protein": 32},
        {"time": "9:00 PM", "meal": "Dinner", "name": "Soya chunks curry + 3 roti + dal + salad", "calories": 640, "protein": 36},
        {"time": "10:30 PM", "meal": "Night", "name": "1 cup warm full fat milk with turmeric and ashwagandha", "calories": 160, "protein": 8},
    ]

    non_veg_lose_adult = [
        {"time": "6:30 AM", "meal": "Early Morning", "name": "Warm lemon water + 5 soaked almonds", "calories": 60, "protein": 2},
        {"time": "8:00 AM", "meal": "Breakfast", "name": "3 egg white omelette with spinach + 1 brown bread + black coffee", "calories": 290, "protein": 26},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "1 apple + 10 walnuts", "calories": 160, "protein": 3},
        {"time": "1:30 PM", "meal": "Lunch", "name": "Grilled chicken breast 150g + brown rice 1 cup + mixed salad + lemon", "calories": 430, "protein": 40},
        {"time": "4:00 PM", "meal": "Evening Snack", "name": "2 boiled eggs + cucumber and carrot sticks", "calories": 160, "protein": 14},
        {"time": "7:00 PM", "meal": "Pre Workout", "name": "1 banana + black coffee (no sugar)", "calories": 100, "protein": 1},
        {"time": "9:00 PM", "meal": "Dinner", "name": "Grilled fish 150g + stir fried vegetables + clear soup", "calories": 350, "protein": 36},
    ]

    non_veg_gain_adult = [
        {"time": "5:30 AM", "meal": "Early Morning", "name": "Mass gainer shake + 10 almonds + 2 dates", "calories": 480, "protein": 32},
        {"time": "8:00 AM", "meal": "Breakfast", "name": "6 whole egg omelette with cheese + 2 brown bread + whole milk", "calories": 650, "protein": 50},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "Chicken sandwich on whole wheat + protein shake", "calories": 480, "protein": 40},
        {"time": "1:30 PM", "meal": "Lunch", "name": "Chicken curry 200g + white rice 2 cups + dal + salad", "calories": 720, "protein": 50},
        {"time": "4:00 PM", "meal": "Pre Workout", "name": "Oats + banana + peanut butter + milk smoothie", "calories": 430, "protein": 18},
        {"time": "6:30 PM", "meal": "Post Workout", "name": "Whey protein 2 scoops + milk + banana", "calories": 380, "protein": 50},
        {"time": "9:00 PM", "meal": "Dinner", "name": "Grilled chicken 200g + 3 whole wheat roti + vegetables + dal", "calories": 680, "protein": 52},
        {"time": "10:30 PM", "meal": "Night", "name": "Casein protein OR warm milk with turmeric", "calories": 200, "protein": 22},
    ]

    non_veg_lose_senior = [
        {"time": "7:00 AM", "meal": "Early Morning", "name": "Warm lemon honey water", "calories": 30, "protein": 0},
        {"time": "8:30 AM", "meal": "Breakfast", "name": "2 boiled eggs + 1 toast + green tea", "calories": 240, "protein": 16},
        {"time": "11:00 AM", "meal": "Mid Morning", "name": "Fruit bowl + handful of nuts", "calories": 150, "protein": 4},
        {"time": "1:00 PM", "meal": "Lunch", "name": "Grilled fish 100g + soft khichdi + boiled vegetables", "calories": 380, "protein": 28},
        {"time": "4:00 PM", "meal": "Evening Snack", "name": "Makhana + herbal tea", "calories": 100, "protein": 3},
        {"time": "7:30 PM", "meal": "Dinner", "name": "Chicken soup with vegetables + 1 soft roti", "calories": 300, "protein": 22},
    ]

    if age_group == "senior":
        meals = veg_lose_senior if is_veg else non_veg_lose_senior
    elif age_group == "teen":
        meals = veg_lose_teen if is_veg else non_veg_lose_adult
    elif goal == "gain_muscle":
        meals = veg_gain_adult if is_veg else non_veg_gain_adult
    elif goal == "lose_weight":
        meals = veg_lose_adult if is_veg else non_veg_lose_adult
    else:
        meals = veg_lose_adult if is_veg else non_veg_lose_adult

    if is_vegan:
        for meal in meals:
            meal["name"] = meal["name"].replace("paneer", "tofu").replace("curd", "coconut yogurt").replace("milk", "oat milk").replace("whey protein", "pea protein").replace("ghee", "coconut oil")

    allergen_keywords = {
        "gluten": ["roti", "bread", "toast", "paratha", "upma", "poha", "oats"],
        "dairy": ["paneer", "curd", "milk", "yogurt", "cheese", "butter", "whey"],
        "nuts": ["almond", "walnut", "cashew", "peanut", "nut"],
        "eggs": ["egg"],
        "fish": ["fish", "salmon", "tuna"],
    }
    for meal in meals:
        for allergy in allergies:
            if allergy in allergen_keywords:
                for kw in allergen_keywords[allergy]:
                    if kw in meal["name"].lower():
                        meal["name"] += f" [NOTE: contains {allergy} — substitute as needed]"
                        break

    return meals


def generate_grocery(dietary_pref, goal, age_group, allergies):
    is_veg = dietary_pref in ["vegetarian", "vegan"]

    all_items = {
        "veg_lose": [
            "Brown rice", "Moong dal", "Chana dal", "Multigrain roti", "Oats",
            "Spinach", "Broccoli", "Cucumber", "Tomatoes", "Capsicum", "Bitter gourd",
            "Lemons", "Apples", "Papaya", "Pomegranate", "Guava",
            "Almonds", "Walnuts", "Flaxseeds", "Chia seeds",
            "Low fat paneer", "Low fat curd", "Greek yogurt",
            "Sprouts (moong)", "Makhana", "Green tea", "Herbal tea", "Coconut water"
        ],
        "veg_gain": [
            "Whole milk", "Full fat paneer", "Rajma", "Chickpeas", "Soya chunks", "Tofu",
            "Peanut butter (natural)", "Oats", "Bananas", "Dates", "Figs",
            "Mixed nuts", "Avocado", "Sweet potato", "Quinoa",
            "Whey protein (vegetarian)", "Mass gainer (if needed)",
            "Brown rice", "Whole wheat bread", "Desi ghee",
            "Flaxseeds", "Pumpkin seeds", "Sunflower seeds"
        ],
        "non_veg_lose": [
            "Chicken breast (skinless)", "Fish (salmon / rohu / tuna / tilapia)",
            "Egg whites", "Whole eggs (limit 2/day)",
            "Brown rice", "Broccoli", "Spinach", "Cucumber", "Zucchini",
            "Lemons", "Apples", "Berries", "Watermelon",
            "Almonds", "Walnuts", "Greek yogurt (low fat)",
            "Green tea", "Black coffee", "Cauliflower", "Celery"
        ],
        "non_veg_gain": [
            "Chicken breast", "Chicken thighs", "Lean beef / mutton",
            "Fish (salmon / tuna)", "Whole eggs", "Egg whites",
            "Whey protein", "Casein protein",
            "Whole milk", "Peanut butter", "Oats", "Bananas", "Sweet potato",
            "Brown rice", "Whole wheat bread", "Avocado", "Mixed nuts",
            "Cottage cheese", "Olive oil", "Quinoa"
        ],
        "senior": [
            "Soft khichdi ingredients (moong dal, rice)", "Idli batter",
            "Soft seasonal vegetables", "Papaya", "Banana", "Pomegranate",
            "Warm milk", "Turmeric", "Ginger", "Makhana", "Soaked almonds",
            "Low fat curd", "Coconut water", "Fish (easy to chew)",
            "Moong dal", "Masoor dal", "Whole grain bread (soft)"
        ]
    }

    if age_group == "senior":
        items = all_items["senior"]
    elif goal == "gain_muscle":
        items = all_items["veg_gain"] if is_veg else all_items["non_veg_gain"]
    else:
        items = all_items["veg_lose"] if is_veg else all_items["non_veg_lose"]

    return filter_allergies(items, allergies)


def generate_tips(goal, bmi_category, dietary_pref, age_group, lifestyle):
    base = {
        "lose_weight": [
            "Drink 3-4 litres of water daily — start each meal with a full glass",
            "Try 16:8 intermittent fasting: eat only between 12pm-8pm for accelerated fat loss",
            "Eat protein first at every meal to stay full longer and preserve muscle",
            "Eliminate liquid calories — no juice, soda, or sweetened drinks",
            "Sleep 7-8 hours — poor sleep raises ghrelin (hunger hormone) by 30%",
            "Add 20-30 mins cardio after weight training for maximum fat burn",
            "Fill half your plate with non-starchy vegetables at every meal",
            "Stop eating 2-3 hours before bedtime to improve fat burning overnight",
            "Track your meals using MyFitnessPal for 2 weeks to understand habits",
            "Black coffee or green tea 30 mins before workout boosts fat oxidation",
        ],
        "gain_muscle": [
            "Eat 1.8-2.2g protein per kg of bodyweight every single day",
            "Eat every 3-4 hours to keep muscle protein synthesis elevated",
            "Take creatine monohydrate 5g daily — most researched supplement for size and strength",
            "Eat fast-digesting carbs immediately post workout for faster recovery",
            "Sleep 8-9 hours — 70% of muscle growth happens during deep sleep",
            "Progressive overload is non-negotiable — increase weight or reps weekly",
            "Have casein protein or whole milk before bed for overnight muscle repair",
            "Focus on compound lifts — squat, deadlift, bench press, rows",
            "Train each muscle group 2x per week for maximum hypertrophy",
            "Vitamin D (2000IU) and Zinc (25mg) daily support testosterone and recovery",
        ],
        "maintain": [
            "Weigh yourself weekly at the same time to track maintenance",
            "Eat balanced macros — roughly 40% carbs, 30% protein, 30% fats",
            "Stay hydrated with 2.5-3 litres of water daily",
            "Aim for 150 mins of moderate exercise weekly (WHO recommendation)",
            "Eat 5-7 servings of fruits and vegetables daily for micronutrients",
            "Practise mindful eating — no screens during meals, chew slowly",
            "Do a monthly check-in on energy, sleep, and body composition",
        ]
    }

    age_tips = {
        "teen": [
            "Teens need extra calcium — include 3 servings of dairy or fortified foods daily",
            "Do NOT restrict calories severely during teenage years — it impacts bone density",
            "Iron is critical, especially for teen girls — include lentils, leafy greens, eggs",
            "Avoid processed foods and energy drinks — they spike insulin and cause acne",
        ],
        "senior": [
            "Seniors need 20-25% more protein than younger adults to prevent muscle loss (sarcopenia)",
            "Calcium (1200mg) and Vitamin D (800IU) are critical for bone health after 60",
            "Stay hydrated — thirst sensation decreases with age, drink water on a schedule",
            "Eat soft, easy-to-digest foods if experiencing digestive issues",
            "Walk 30 minutes daily — it's the single best exercise for longevity after 60",
        ],
        "adult": [],
        "child": [
            "Children need balanced nutrition across all food groups for growth",
            "Never put children on restrictive diets without paediatric guidance",
            "Ensure adequate calcium and Vitamin D for bone development",
        ]
    }

    lifestyle_tips = {
        "athlete": [
            "Periodise your nutrition — eat more on training days, less on rest days",
            "Electrolytes (sodium, potassium, magnesium) are critical for performance",
            "Tart cherry juice reduces muscle soreness — have 30ml before bed",
        ],
        "office": [
            "Get up and walk for 5 minutes every hour to counteract sitting",
            "Meal prep on Sundays to avoid ordering unhealthy office lunches",
            "Keep healthy snacks at your desk — nuts, fruits, makhana",
        ],
        "student": [
            "Brain performance depends on glucose — never skip breakfast before exams",
            "Omega-3 from fish or flaxseeds improves memory and concentration",
            "Avoid all-nighters — sleep consolidates memory better than extra studying",
        ],
        "general": []
    }

    world_class = [
        "Dr Andrew Huberman: Morning sunlight within 30 mins of waking sets your cortisol and sleep cycle",
        "Dr Peter Attia: Zone 2 cardio (conversational pace) for 3-4 hours/week is the foundation of longevity",
        "Dr Rhonda Patrick: Sauna use 3-4x/week shown to reduce cardiovascular disease risk by 50%",
        "Dr Mark Hyman: Eat the rainbow — different coloured vegetables provide different phytonutrients",
        "Jeff Nippard: Train within 1-2 reps of failure for maximum muscle stimulus, not to absolute failure",
    ]

    tips = base.get(goal, base["maintain"])
    tips += age_tips.get(age_group, [])
    tips += lifestyle_tips.get(lifestyle, [])
    tips += world_class[:3]
    return tips


@router.post("/plan", response_model=DietPlan)
def get_diet_plan(profile: UserProfile):
    bmi, bmi_category = calculate_bmi(profile.weight, profile.height)
    calories = calculate_calories(profile)
    age_group = get_age_group(profile.age)

    if profile.goal == "gain_muscle":
        protein = int(profile.weight * 2.0)
    elif profile.goal == "lose_weight":
        protein = int(profile.weight * 1.6)
    elif age_group == "senior":
        protein = int(profile.weight * 1.6)
    else:
        protein = int(profile.weight * 1.4)

    fats = int(calories * 0.25 / 9)
    carbs = int((calories - protein * 4 - fats * 9) / 4)
    fiber = 30 if profile.goal == "lose_weight" else 25
    water = round(profile.weight * 0.033 + (0.5 if profile.activity in ["active", "very_active"] else 0), 1)

    meal_timing = (
        "Eat every 3-4 hours to keep protein synthesis high" if profile.goal == "gain_muscle"
        else "16:8 intermittent fasting recommended (eat 12pm-8pm)" if profile.goal == "lose_weight"
        else "3 main meals + 2 snacks at consistent times daily"
    )

    diet_labels = {
        "gain_muscle": "High Protein Muscle Building Plan",
        "lose_weight": "Calorie Deficit Fat Loss Plan",
        "maintain": "Balanced Maintenance Plan"
    }

    allergy_note = ""
    if profile.allergies:
        allergy_note = f"Allergy alerts active for: {', '.join(profile.allergies)}. Flagged meals are marked — please substitute."

    return DietPlan(
        bmi=bmi,
        bmi_category=bmi_category,
        daily_calories=calories,
        protein_g=protein,
        carbs_g=carbs,
        fats_g=fats,
        fiber_g=fiber,
        meals=generate_meals(profile.dietary_pref, profile.goal, age_group, profile.allergies),
        grocery_list=generate_grocery(profile.dietary_pref, profile.goal, age_group, profile.allergies),
        tips=generate_tips(profile.goal, bmi_category, profile.dietary_pref, age_group, profile.lifestyle),
        diet_type=diet_labels.get(profile.goal, "Balanced Plan"),
        water_intake_litres=water,
        meal_timing=meal_timing,
        age_group=age_group,
        allergy_note=allergy_note
    )


@router.get("/calories/{food}")
def get_food_calories(food: str):
    food_db = {
        "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fats": 0.3, "fiber": 0.4, "per": "100g"},
        "brown_rice": {"calories": 111, "protein": 2.6, "carbs": 23, "fats": 0.9, "fiber": 1.8, "per": "100g"},
        "chicken": {"calories": 165, "protein": 31, "carbs": 0, "fats": 3.6, "fiber": 0, "per": "100g"},
        "chicken_breast": {"calories": 165, "protein": 31, "carbs": 0, "fats": 3.6, "fiber": 0, "per": "100g"},
        "chicken_thigh": {"calories": 209, "protein": 26, "carbs": 0, "fats": 11, "fiber": 0, "per": "100g"},
        "egg": {"calories": 68, "protein": 6, "carbs": 0.6, "fats": 4.8, "fiber": 0, "per": "1 egg"},
        "egg_white": {"calories": 17, "protein": 3.6, "carbs": 0.2, "fats": 0.1, "fiber": 0, "per": "1 egg white"},
        "banana": {"calories": 89, "protein": 1.1, "carbs": 23, "fats": 0.3, "fiber": 2.6, "per": "1 medium"},
        "apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fats": 0.2, "fiber": 2.4, "per": "1 medium"},
        "oats": {"calories": 389, "protein": 17, "carbs": 66, "fats": 7, "fiber": 10, "per": "100g"},
        "paneer": {"calories": 265, "protein": 18, "carbs": 1.2, "fats": 20, "fiber": 0, "per": "100g"},
        "tofu": {"calories": 76, "protein": 8, "carbs": 2, "fats": 4.8, "fiber": 0.3, "per": "100g"},
        "dal": {"calories": 116, "protein": 9, "carbs": 20, "fats": 0.4, "fiber": 8, "per": "100g"},
        "moong_dal": {"calories": 105, "protein": 7, "carbs": 19, "fats": 0.4, "fiber": 7, "per": "100g"},
        "rajma": {"calories": 127, "protein": 8.7, "carbs": 22, "fats": 0.5, "fiber": 6.4, "per": "100g"},
        "chickpea": {"calories": 164, "protein": 8.9, "carbs": 27, "fats": 2.6, "fiber": 7.6, "per": "100g"},
        "roti": {"calories": 71, "protein": 3, "carbs": 15, "fats": 0.4, "fiber": 1.9, "per": "1 roti"},
        "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fats": 13, "fiber": 0, "per": "100g"},
        "tuna": {"calories": 132, "protein": 29, "carbs": 0, "fats": 1, "fiber": 0, "per": "100g"},
        "sweet_potato": {"calories": 86, "protein": 1.6, "carbs": 20, "fats": 0.1, "fiber": 3, "per": "100g"},
        "peanut_butter": {"calories": 588, "protein": 25, "carbs": 20, "fats": 50, "fiber": 6, "per": "100g"},
        "whey_protein": {"calories": 120, "protein": 24, "carbs": 3, "fats": 1.5, "fiber": 0, "per": "1 scoop (30g)"},
        "almonds": {"calories": 579, "protein": 21, "carbs": 22, "fats": 50, "fiber": 12.5, "per": "100g"},
        "walnuts": {"calories": 654, "protein": 15, "carbs": 14, "fats": 65, "fiber": 6.7, "per": "100g"},
        "greek_yogurt": {"calories": 59, "protein": 10, "carbs": 3.6, "fats": 0.4, "fiber": 0, "per": "100g"},
        "quinoa": {"calories": 120, "protein": 4.4, "carbs": 21, "fats": 1.9, "fiber": 2.8, "per": "100g"},
        "avocado": {"calories": 160, "protein": 2, "carbs": 9, "fats": 15, "fiber": 6.7, "per": "100g"},
        "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fats": 0.4, "fiber": 2.6, "per": "100g"},
        "spinach": {"calories": 23, "protein": 2.9, "carbs": 3.6, "fats": 0.4, "fiber": 2.2, "per": "100g"},
        "milk": {"calories": 61, "protein": 3.2, "carbs": 4.8, "fats": 3.3, "fiber": 0, "per": "100ml"},
        "soya_chunks": {"calories": 345, "protein": 52, "carbs": 33, "fats": 0.5, "fiber": 13, "per": "100g"},
        "makhana": {"calories": 347, "protein": 9.7, "carbs": 77, "fats": 0.1, "fiber": 14.5, "per": "100g"},
        "sprouts": {"calories": 30, "protein": 3, "carbs": 5.9, "fats": 0.2, "fiber": 1.8, "per": "100g"},
        "curd": {"calories": 61, "protein": 3.5, "carbs": 4.7, "fats": 3.3, "fiber": 0, "per": "100g"},
        "cottage_cheese": {"calories": 98, "protein": 11, "carbs": 3.4, "fats": 4.3, "fiber": 0, "per": "100g"},
        "olive_oil": {"calories": 884, "protein": 0, "carbs": 0, "fats": 100, "fiber": 0, "per": "100ml"},
        "flaxseeds": {"calories": 534, "protein": 18, "carbs": 29, "fats": 42, "fiber": 27, "per": "100g"},
        "chia_seeds": {"calories": 486, "protein": 17, "carbs": 42, "fats": 31, "fiber": 34, "per": "100g"},
        "dates": {"calories": 277, "protein": 1.8, "carbs": 75, "fats": 0.2, "fiber": 6.7, "per": "100g"},
        "ghee": {"calories": 900, "protein": 0, "carbs": 0, "fats": 100, "fiber": 0, "per": "100g"},
        "coconut_water": {"calories": 19, "protein": 0.7, "carbs": 3.7, "fats": 0.2, "fiber": 1.1, "per": "100ml"},
        "papaya": {"calories": 43, "protein": 0.5, "carbs": 11, "fats": 0.3, "fiber": 1.7, "per": "100g"},
        "watermelon": {"calories": 30, "protein": 0.6, "carbs": 7.6, "fats": 0.2, "fiber": 0.4, "per": "100g"},
        "idli": {"calories": 58, "protein": 2, "carbs": 12, "fats": 0.4, "fiber": 0.5, "per": "1 idli"},
        "sambar": {"calories": 65, "protein": 3.5, "carbs": 10, "fats": 1.5, "fiber": 2.5, "per": "1 cup"},
    }
    key = food.lower().replace(" ", "_")
    if key in food_db:
        return {"food": food, **food_db[key]}
    return {"error": f"'{food}' not found. Try: chicken, brown_rice, paneer, oats, salmon, etc."}