from typing import List, Optional
from pydantic import BaseModel

class Filters(BaseModel):
    job_title: str
    required_experience: Optional[str] = None
    technologies: Optional[List[str]] = None
    work_type: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None 
    salary_range: Optional[str] = None
