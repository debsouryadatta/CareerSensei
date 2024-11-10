import os
import traceback
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse

from utils.resume_jobs import process_resume

resume_router = APIRouter(
    prefix="/resume",
    tags=["resume"],
    responses={404: {"description": "Not found"}}
)


@resume_router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Endpoint handler for resume upload and processing"""
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
        
        # Read file content
        pdf_content = await file.read()
        
        # Process resume
        result = await process_resume(pdf_content)
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Resume processed successfully",
                "resume_analysis": result["resume_analysis"],
                "job_matches": result["job_matches"]
            },
            status_code=201
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


