from typing import List, Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON

class JobBase(SQLModel):
    job_title: str
    required_experience: str
    technologies: List[str] = Field(sa_column=Column(JSON))
    work_type: str
    location: str
    company: str
    required_qualifications: List[str] = Field(sa_column=Column(JSON))
    application_link: str
    job_description: str
    salary_range: str

class JobCreate(JobBase):
    pass
    
class Filters(BaseModel):
    job_title: str
    required_experience: Optional[str] = None
    technologies: Optional[List[str]] = None
    work_type: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None 
    salary_range: Optional[str] = None


class Jobs(JobBase, table=True):
    id: int = Field(default=None, primary_key=True)