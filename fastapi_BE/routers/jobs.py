import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from db.db import get_session
from models.models import JobCreate, Jobs


jobs_router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    responses={404: {"description": "Not found"}}
)

@jobs_router.post("/save")
async def save_job(job: JobCreate, session=Depends(get_session)):
    try:
        db_job = Jobs(**job.model_dump())
        session.add(db_job)
        session.commit()
        session.refresh(db_job)
        return {"success": True, "message": "Job saved successfully", "job": db_job}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))