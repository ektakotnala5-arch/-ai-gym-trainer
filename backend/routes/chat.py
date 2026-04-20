from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/chat", tags=["AI Chat"])

SYSTEM_PROMPT = """You are MY AI — a smart helpful assistant like ChatGPT. Answer any question on any topic: fitness, diet, workouts, science, math, coding, history, general knowledge. Be detailed, helpful, friendly and use emojis occasionally."""

class ChatMessage(BaseModel):
    message: str
    history: list = []

@router.post("/message")
async def chat(req: ChatMessage):
    try:
        # Build conversation for context
        history_text = ""
        for msg in req.history[-6:]:
            role = "User" if msg.get("role") == "user" else "MY AI"
            history_text += f"{role}: {msg.get('content', '')}\n"
        
        full_prompt = SYSTEM_PROMPT + "\n\n" + history_text + f"User: {req.message}\nMY AI:"

        # Using Pollinations anonymous endpoint (no API key needed)
        res = requests.get(
            f"https://text.pollinations.ai/{requests.utils.quote(full_prompt)}",
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        if res.status_code == 200:
            reply = res.text.strip()
            # Filter out the deprecation notice if it appears
            if "IMPORTANT NOTICE" in reply or "legacy text API" in reply:
                raise Exception("Pollinations notice received")
            return {"reply": reply, "status": "ok"}
        else:
            raise Exception(f"Status {res.status_code}")

    except Exception as e:
        # Fallback: use OpenRouter free tier (no key needed for some models)
        try:
            res2 = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json={
                    "model": "mistralai/mistral-7b-instruct:free",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": req.message}
                    ]
                },
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            data = res2.json()
            reply = data["choices"][0]["message"]["content"]
            return {"reply": reply, "status": "ok"}
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"AI error: {str(e2)}")