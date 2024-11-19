import os
import traceback
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import Literal

from utils.resume_score import process_resume_score
from utils.resume_jobs import process_resume

resume_router = APIRouter(
    prefix="/resume",
    tags=["resume"],
    responses={404: {"description": "Not found"}}
)


@resume_router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    file_type: Literal["pdf", "image"] = Form(...)
):
    try:
        # Validate file type
        if file_type == "pdf" and not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Invalid file type. Expected PDF file.")
        elif file_type == "image" and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Expected image file.")
        
        # Read file content
        file_content = await file.read()
        
        # Process resume
        result = await process_resume(file_content, file_type)
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Resume processed successfully",
                "data": result
            },
            status_code=200
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@resume_router.post("/score")
async def score_resume(
    file: UploadFile = File(...),
    file_type: Literal["pdf", "image"] = Form(...)
):
    try:
        # Validate file type
        if file_type == "pdf" and not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Invalid file type. Expected PDF file.")
        elif file_type == "image" and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Expected image file.")
        
        # Read file content
        file_content = await file.read()
        
        # Process and score resume
        result = await process_resume_score(file_content, file_type)
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Resume scored successfully",
                "data": result
            },
            status_code=200
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
