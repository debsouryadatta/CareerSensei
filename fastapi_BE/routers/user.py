import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse


user_router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}}
)

# Sign up
@user_router.post("/signup")
async def signup():
    try:
        return JSONResponse(content={"success": True, "message": "User Signed Up"}, status_code=201)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    

# Sign in
@user_router.post("/signin")
async def signin():
    try:
        return JSONResponse(content={"success": True, "message": "User Signed in"}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    


@user_router.get("/me")
async def me():
    try:
        return JSONResponse(content={"success": True, "message": "Hey! Thats me"}, status_code=201)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
        
        
        
        