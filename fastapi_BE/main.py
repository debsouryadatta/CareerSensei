from contextlib import asynccontextmanager
import traceback
from fastapi import Depends, FastAPI, APIRouter
from routers import jobs
from routers import filters
from routers import resume
from routers import user
from routers import cover_letter
import uvicorn

from db.db import create_table, get_session
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings


# Creating a context manager so that we can connect to db & create tables before starting the app
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating Tables")
    create_table()
    print("Tables Created")
    yield


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_title,
    description=settings.app_description
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(
    prefix="/api/v1"
)
router.include_router(user.user_router)
router.include_router(resume.resume_router)
router.include_router(filters.filter_router)
router.include_router(jobs.jobs_router)
router.include_router(cover_letter.cover_letter_router)
app.include_router(router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        server_header=False,
    )