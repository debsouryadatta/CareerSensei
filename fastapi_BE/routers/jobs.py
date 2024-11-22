import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from db.db import get_session
from auth.auth import validate_token
from models.models import JobCreate, Jobs


jobs_router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(validate_token)]
)

@jobs_router.post("/save/{user_id}")
async def save_job(job: JobCreate, user_id: int, session=Depends(get_session)):
    try:
        job = Jobs(**job.model_dump(), user_id=user_id)
        session.add(job)
        session.commit()
        session.refresh(job)
        return JSONResponse(content={"success": True, "message": "Job saved successfully", "job": job.model_dump()}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@jobs_router.get("/{user_id}")
async def get_jobs(user_id: int, session=Depends(get_session)):
    try:
        jobs = session.query(Jobs).filter(Jobs.user_id == user_id).all()
        return JSONResponse(content={"success": True, "message": "Jobs fetched successfully", "jobs": [job.model_dump() for job in jobs]}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@jobs_router.get("/get_by_id/{job_id}")
async def get_job_by_id(job_id: int, session=Depends(get_session)):
    try:
        job = session.query(Jobs).filter(Jobs.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return JSONResponse(content={"success": True, "message": "Job fetched successfully", "job": job.model_dump()}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@jobs_router.delete("/{job_id}")
async def delete_job(job_id: int, session=Depends(get_session)):
    try:
        job = session.query(Jobs).filter(Jobs.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        session.delete(job)
        session.commit()
        return JSONResponse(content={"success": True, "message": "Job deleted successfully"}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))