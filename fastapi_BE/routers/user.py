import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from db.db import get_session
from auth.auth import validate_token
from models.models import UserCreate, Users


user_router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(validate_token)]
)

@user_router.post("/register")
async def register_user(user_data: UserCreate, session=Depends(get_session)):
    try:
        print(f"User data: {user_data}")
        user_exists = session.query(Users).filter(Users.email == user_data.email).first()
        if user_exists:
            return JSONResponse(content={"success": True, "message": "User already exists", "user_data": user_exists.model_dump()}, status_code=200)
        else:
            db_user = Users(**user_data.model_dump())
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            return JSONResponse(content={"success": True, "message": "User registered successfully", "user_data": db_user.model_dump()}, status_code=201)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
        
        
        
        