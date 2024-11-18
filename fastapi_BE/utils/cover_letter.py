from typing import Dict
from fastapi import HTTPException
import traceback
from dotenv import load_dotenv
import PyPDF2
from io import BytesIO
import base64

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from core.config import settings
from utils.resume_jobs import ResumeProcessor

load_dotenv()

class CoverLetterGenerator:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.sambanova_api_key,
            base_url="https://api.sambanova.ai/v1",
            model="Meta-Llama-3.1-70B-Instruct",
            temperature=0.7
        )
        self.resume_processor = ResumeProcessor()

    async def generate_cover_letter(self, resume_text: str, job_description: str) -> str:
        """Generate a cover letter based on resume and job description"""
        try:
            prompt = f"""Generate a professional cover letter based on the following resume and job description. 
            The cover letter should highlight relevant skills and experiences that match the job requirements.
            
            Resume:
            {resume_text}
            
            Job Description:
            {job_description}
            
            Create a compelling cover letter that:
            1. Opens with a strong introduction
            2. Highlights relevant experience and skills
            3. Shows enthusiasm for the role and company
            4. Concludes professionally
            """
            
            response = await self.model.ainvoke([SystemMessage(content=prompt)])
            return response.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating cover letter: {str(e)}")

async def process_cover_letter(
    resume_content: bytes,
    resume_type: str,
    job_description: str = None,
    job_description_file: bytes = None,
    job_description_type: str = None
) -> Dict:
    """Process resume and job description to generate a cover letter"""
    try:
        generator = CoverLetterGenerator()
        
        # Extract resume text
        if resume_type == "pdf":
            resume_text = await generator.resume_processor.extract_text_from_pdf(resume_content)
        else:
            resume_text = await generator.resume_processor.extract_text_from_image(resume_content)
        
        # Process job description
        if job_description_type == "text":
            job_desc_text = job_description
        else:
            if job_description_type == "pdf":
                job_desc_text = await generator.resume_processor.extract_text_from_pdf(job_description_file)
            else:
                job_desc_text = await generator.resume_processor.extract_text_from_image(job_description_file)
        
        # Generate cover letter
        cover_letter = await generator.generate_cover_letter(resume_text, job_desc_text)
        
        return {
            "cover_letter": cover_letter,
            "resume_text": resume_text,
            "job_description": job_desc_text
        }
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


