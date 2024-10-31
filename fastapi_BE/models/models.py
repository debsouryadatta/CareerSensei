from pydantic import BaseModel

class Filters(BaseModel):
    job_title: str
    experience: list
    technologies: list
    work_type: str
    location: str
    company: str
