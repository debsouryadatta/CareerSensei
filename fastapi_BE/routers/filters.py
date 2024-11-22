import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from auth.auth import validate_token
from models.models import Filters
from utils.filters_jobs import process_job_search


filter_router = APIRouter(
    prefix="/filters",
    tags=["filters"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(validate_token)]
)

@filter_router.post("/job_search")
async def job_search(filters: Filters):
    try:
        # Convert Filters model to dict
        filter_dict = filters.dict(exclude_none=True)
        # Process job search
        results = await process_job_search(filter_dict)
        return JSONResponse(content={
                "success": True,
                "message": "Job search processed successfully",
                "job_matches": results["job_matches"]
            }, status_code=200)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))