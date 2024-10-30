import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from models.models import Filters


filter_router = APIRouter(
    prefix="/filters",
    tags=["filters"],
    responses={404: {"description": "Not found"}}
)

@filter_router.get("/job_search")
async def job_search(filters: Filters):
    try:
        return JSONResponse(content={"success": True, "message": "Job Search"}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))