import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from database import users_col
import hashlib
import hmac
import bcrypt

router = APIRouter(prefix="/auth", tags=["Authentication"])
SECRET_KEY = os.getenv("SECRET_KEY", "aigymtrainer2024supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

def hash_password(password: str) -> str:
    # Use sha256 first to avoid bcrypt 72 byte limit
    password_bytes = hashlib.sha256(password.encode('utf-8')).hexdigest().encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes = hashlib.sha256(plain.encode('utf-8')).hexdigest().encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed.encode('utf-8'))

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await users_col.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register")
async def register(req: RegisterRequest):
    try:
        existing = await users_col.find_one({"email": req.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user = {
            "name": req.name,
            "email": req.email,
            "password": hash_password(req.password),
            "created_at": datetime.utcnow().isoformat(),
            "streak": 0,
            "total_workouts": 0,
        }
        result = await users_col.insert_one(user)
        token = create_token({"sub": req.email})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(result.inserted_id),
                "name": req.name,
                "email": req.email,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await users_col.find_one({"email": form.username})
        if not user or not verify_password(form.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = create_token({"sub": user["email"]})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "streak": current_user.get("streak", 0),
        "total_workouts": current_user.get("total_workouts", 0),
        "created_at": current_user.get("created_at", ""),
    }

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}