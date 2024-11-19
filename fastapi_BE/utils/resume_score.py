import traceback
from typing import Dict, Tuple
from fastapi import HTTPException
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from core.config import settings
from utils.resume_jobs import ResumeProcessor
import json

class ResumeScorer:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.sambanova_api_key,
            base_url="https://api.sambanova.ai/v1",
            model="Meta-Llama-3.1-70B-Instruct",
            temperature=0.3
        )
        self.resume_processor = ResumeProcessor()

    async def detect_domain(self, resume_text: str) -> str:
        """Detect the professional domain from resume text"""
        prompt = f"""Analyze the following resume and determine the primary professional domain 
        (e.g., Software Engineering, Data Science, Marketing, etc.):
        
        {resume_text}
        
        Return only the domain name, nothing else."""
        
        response = await self.model.ainvoke([SystemMessage(content=prompt)])
        return response.content.strip()

    async def generate_advice(self, resume_text: str, domain: str, component_scores: Dict) -> str:
        """Generate personalized advice based on resume content, domain and scores"""
        advice_prompt = f"""Analyze this {domain} resume and provide specific improvement recommendations.

        Resume Text:
        {resume_text}

        Component Scores (out of 20 each):
        {json.dumps(component_scores, indent=2)}

        Based on a thorough analysis of both the resume content and scores:
        1. Identify key missing elements or weak areas
        2. Provide 4-5 specific, actionable recommendations
        3. Include domain-specific advice for {domain} professionals
        4. Focus especially on components that scored below 15 points
        
        Return only a bullet-point list of recommendations, no other text."""
        
        response = await self.model.ainvoke([SystemMessage(content=advice_prompt)])
        return response.content.strip()

    async def calculate_score(self, resume_text: str, domain: str) -> Tuple[int, Dict, str]:
        """Calculate resume score based on various components"""
        scoring_prompt = f"""Analyze this {domain} resume and score each component:
        
        Resume Text:
        {resume_text}
        
        Score these components (0-20 points each):
        1. Professional Experience (relevance, clarity, achievements)
        2. Skills & Technologies (relevance to {domain}, breadth, depth)
        3. Education & Certifications
        4. Resume Format & Organization
        5. Overall Impact & Effectiveness

        Only return the JSON object with exactly these keys and numerical scores without any quotes or other text:
        1. "Professional Experience": score,
        2. "Skills & Technologies": score,
        3. "Education & Certifications": score,
        4. "Resume Format": score,
        5. "Overall Impact": score
        """
        
        try:
            response = await self.model.ainvoke([SystemMessage(content=scoring_prompt)])
            # Clean the response string and parse JSON
            try:
                json_str = response.content.strip()
                scores = json.loads(json_str)
            except json.JSONDecodeError:
                # If direct parsing fails, try to find JSON-like structure in the text
                import re
                json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
                if json_match:
                    scores = json.loads(json_match.group())
                else:
                    raise ValueError("No JSON structure found in response")
            
            print(f"JSON STR: {scores}")
            
            # Validate scores
            for key, value in scores.items():
                if not isinstance(value, (int, float)) or value < 0 or value > 20:
                    raise ValueError(f"Invalid score for {key}: {value}")
            
            total_score = sum(scores.values())
            # Generate advice based on full resume analysis
            advice = await self.generate_advice(resume_text, domain, scores)
            return total_score, scores, advice
            
        except Exception as e:
            print(f"Traceback error: {traceback.print_exc()}")
            raise HTTPException(status_code=500, detail=f"Error calculating scores: {str(e)}")

async def process_resume_score(
    resume_content: bytes,
    resume_type: str
) -> Dict:
    """Process resume and generate score"""
    try:
        scorer = ResumeScorer()
        
        # Extract text from resume
        if resume_type == "pdf":
            resume_text = await scorer.resume_processor.extract_text_from_pdf(resume_content)
        else:
            resume_text = await scorer.resume_processor.extract_text_from_image(resume_content)
        
        # Detect domain
        domain = await scorer.detect_domain(resume_text)
        
        # Calculate scores and get advice
        total_score, component_scores, advice = await scorer.calculate_score(resume_text, domain)
        
        return {
            "domain": domain,
            "total_score": total_score,
            "component_scores": component_scores,
            "resume_text": resume_text,
            "improvement_advice": advice
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
