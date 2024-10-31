from typing import Dict, List
from fastapi import HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
import traceback
from dotenv import load_dotenv
import PyPDF2
from io import BytesIO
from pydantic import BaseModel, Field
from typing import List, Optional
import json

# LangChain imports
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores.faiss import FAISS
from langchain.output_parsers import PydanticOutputParser
from core.config import settings

# Load environment variables
load_dotenv()

# Define the output schema
class JobMatch(BaseModel):
    job_title: str = Field(description="The title of the job position")
    required_experience: Optional[str] = Field(description="Years of experience required", default=None)
    technologies: Optional[List[str]] = Field(description="Key technologies and tools required", default=None)
    work_type: str = Field(description="Type of work arrangement (remote/hybrid/onsite)")
    location: str = Field(description="Location of the job")
    company: str = Field(description="Name of the hiring company")
    required_qualifications: List[str] = Field(description="List of required qualifications for the position")
    application_link: Optional[str] = Field(description="Link to apply for the position", default=None)
    job_description: Optional[str] = Field(description="Brief description of the job role", default=None)
    salary_range: Optional[str] = Field(description="Salary range if available", default=None)

class JobMatchesResponse(BaseModel):
    matches: List[JobMatch] = Field(description="List of matching job opportunities")
    search_summary: Optional[str] = Field(description="Summary of the job search results", default=None)

class ResumeProcessor:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.sambanova_api_key,
            base_url="https://api.sambanova.ai/v1",
            model="Meta-Llama-3.1-70B-Instruct",
            temperature=0.7
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        self.output_parser = PydanticOutputParser(pydantic_object=JobMatchesResponse)
        self.setup_agent()

    def setup_agent(self):
        """Set up the LangChain agent with necessary tools and prompts"""
        # Create tools
        self.search_tool = TavilySearchResults()
        
        # Define the system message without format instructions in the template
        system_message = """You are an expert job search assistant. Your task is to search for relevant job opportunities based on 
        the candidate's resume analysis that will be provided. Use the search tool to find current job openings that match 
        the candidate's profile. Focus on the candidate's actual skills, experience, and qualifications when searching.
        Do not create or assume sample resume content.

        Your response should be a JSON object containing:
        1. A list of job matches, where each match includes:
           - job_title: The title of the position
           - required_experience: Years of experience required (if available)
           - technologies: List of key technologies and tools required (if available)
           - work_type: Whether remote, hybrid, or onsite
           - location: Job location
           - company: Name of the hiring company
           - required_qualifications: List of required skills and qualifications
           - application_link: Link to apply (if available)
           - job_description: Brief description of the role (if available)
           - salary_range: Salary information (if available)
        2. A search_summary field with a brief overview of the results
        """
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])

        # Create agent
        self.agent = create_openai_functions_agent(
            llm=self.model,
            prompt=self.prompt,
            tools=[self.search_tool]
        )

        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=[self.search_tool],
            verbose=True
        )

    async def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        """Extract text content from PDF bytes"""
        try:
            pdf_file = BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text_content = ""
            for page in pdf_reader.pages:
                text_content += page.extract_text()
            
            return text_content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error extracting PDF content: {str(e)}")

    async def analyze_resume(self, text_content: str) -> str:
        """Analyze resume content using LLM to extract key information"""
        try:
            analysis_prompt = """Analyze the following resume and extract key information including:
            1. Professional summary
            2. Key skills and technologies
            3. Years of experience
            4. Current/most recent role
            5. Industry focus

            Resume content:
            {text_content}
            """
            
            response = await self.model.ainvoke(
                [SystemMessage(content=analysis_prompt.format(text_content=text_content))]
            )
            return response.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")

    async def search_jobs(self, resume_analysis: str) -> JobMatchesResponse:
        """Search for relevant jobs based on resume analysis"""
        try:
            # Create a structured message that includes the resume analysis
            messages = [
                HumanMessage(content=f"""Here is the detailed analysis of the candidate's resume:

                    {resume_analysis}

                    Based on this analysis, please search for current job openings that match this candidate's profile. 
                    Find at least 3-5 relevant positions and format the response as a JSON object with 'matches' and 'search_summary' fields.
                    Each job match should include job_title, required_experience (if available), technologies (if available), work_type, location, company, required_qualifications, application_link, 
                    job_description (if available), and salary_range (if available).""")
            ]

            # Get response from agent
            response = await self.agent_executor.ainvoke({
                "input": messages[0].content,
                "chat_history": messages
            })

            # Try to parse the response as JSON
            try:
                # First, try to extract JSON from the text if it's not already JSON
                response_text = response["output"]
                try:
                    # Try to parse directly first
                    json_data = json.loads(response_text)
                except json.JSONDecodeError:
                    # If direct parsing fails, try to find JSON-like structure in the text
                    import re
                    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                    if json_match:
                        json_data = json.loads(json_match.group())
                    else:
                        raise ValueError("No JSON structure found in response")

                # Parse the JSON data into our Pydantic model
                parsed_response = JobMatchesResponse(**json_data)
                return parsed_response

            except Exception as parsing_error:
                print(f"Error parsing response: {parsing_error}")
                print(f"Raw response: {response['output']}")
                # Fallback handling if parsing fails
                return JobMatchesResponse(
                    matches=[],
                    search_summary=f"Error parsing job matches. Raw response: {response['output']}"
                )

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error searching jobs: {str(e)}")

async def process_resume(pdf_content: bytes) -> Dict:
    """Process resume content and return analysis and job matches"""
    try:
        processor = ResumeProcessor()
        
        # Extract text from PDF
        text_content = await processor.extract_text_from_pdf(pdf_content)
        
        # Analyze resume
        resume_analysis = await processor.analyze_resume(text_content)
        
        # Search for matching jobs
        job_matches = await processor.search_jobs(resume_analysis)
        
        return {
            "resume_analysis": resume_analysis,
            "job_matches": job_matches.dict()  # Convert Pydantic model to dict
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))