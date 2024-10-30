from pydantic import BaseModel

class Filters(BaseModel):
    position: str
    experience: list
    location: str
    company: str
    technologies: list