import traceback
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import Literal, Optional
from db.db import get_session
from auth.auth import validate_token
from models.models import CoverLetterCreate, CoverLetters
from utils.cover_letter import process_cover_letter

cover_letter_router = APIRouter(
    prefix="/cover_letter",
    tags=["Cover Letter"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(validate_token)]
)

@cover_letter_router.post("/create")
async def create_cover_letter(
    resume_file: UploadFile = File(...),
    resume_type: Literal["pdf", "image"] = Form(...),
    job_description: Optional[str] = Form(None),
    job_description_file: Optional[UploadFile] = File(None),
    job_description_type: Optional[Literal["text", "pdf", "image"]] = Form(None)
):
    try:
        # Validate inputs
        if job_description is None and job_description_file is None:
            raise HTTPException(
                status_code=400,
                detail="Either job description text or file must be provided"
            )
        
        if job_description_file and not job_description_type:
            raise HTTPException(
                status_code=400,
                detail="Job description type must be provided when uploading a file"
            )
        
        # Read resume file
        resume_content = await resume_file.read()
        
        # Read job description file if provided
        job_desc_content = None
        if job_description_file:
            job_desc_content = await job_description_file.read()
        
        # Process and generate cover letter
        result = await process_cover_letter(
            resume_content,
            resume_type,
            job_description,
            job_desc_content,
            job_description_type
        )
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Cover letter generated successfully",
                "data": result
            },
            status_code=200
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@cover_letter_router.post('/save/{user_id}')
async def save_cover_letter(cover_letter: CoverLetterCreate, user_id: int, session=Depends(get_session)):
    try:
        cover_letter = CoverLetters(**cover_letter.model_dump(), user_id=user_id)
        session.add(cover_letter)
        session.commit()
        session.refresh(cover_letter)
        return JSONResponse(content={"success": True, "message": "Cover letter saved successfully", "cover_letter": cover_letter.model_dump()}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@cover_letter_router.get('/{user_id}')
async def get_cover_letters(user_id: int, session=Depends(get_session)):
    try:
        cover_letters = session.query(CoverLetters).filter(CoverLetters.user_id == user_id).all()
        return JSONResponse(content={"success": True, "message": "Cover letters fetched successfully", "cover_letters": [cover_letter.model_dump() for cover_letter in cover_letters]}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@cover_letter_router.get('/get_by_id/{cover_letter_id}')
async def get_cover_letter_by_id(cover_letter_id: int, session=Depends(get_session)):
    try:
        cover_letter = session.query(CoverLetters).filter(CoverLetters.id == cover_letter_id).first()
        if not cover_letter:
            raise HTTPException(status_code=404, detail="Cover letter not found")
        return JSONResponse(content={"success": True, "message": "Cover letter fetched successfully", "cover_letter": cover_letter.model_dump()}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    
@cover_letter_router.delete('/{cover_letter_id}')
async def delete_cover_letter(cover_letter_id: int, session=Depends(get_session)):
    try:
        cover_letter = session.query(CoverLetters).filter(CoverLetters.id == cover_letter_id).first()
        if not cover_letter:
            raise HTTPException(status_code=404, detail="Cover letter not found")
        session.delete(cover_letter)
        session.commit()
        return JSONResponse(content={"success": True, "message": "Cover letter deleted successfully"}, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    


