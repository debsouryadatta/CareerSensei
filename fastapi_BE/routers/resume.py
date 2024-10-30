import traceback
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse

resume_router = APIRouter(
    prefix="/resume",
    tags=["resume"],
    responses={404: {"description": "Not found"}}
)

@resume_router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
        # Process the file (e.g., save it to disk, analyze it, etc.)
        return JSONResponse(content={"success": True, "message": "Resume Uploaded"}, status_code=201)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


