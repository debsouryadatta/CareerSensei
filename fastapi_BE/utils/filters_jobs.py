from typing import Dict, List, Optional
from fastapi import HTTPException
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.output_parsers import PydanticOutputParser
import json
import traceback
from core.config import settings

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

class JobSearchProcessor:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.sambanova_api_key,
            base_url="https://api.sambanova.ai/v1",
            model="Meta-Llama-3.1-70B-Instruct",
            temperature=0.7
        )
        self.output_parser = PydanticOutputParser(pydantic_object=JobMatchesResponse)
        self.setup_agent()

    def setup_agent(self):
        """Set up the LangChain agent with necessary tools and prompts"""
        # Create tools
        self.search_tool = TavilySearchResults()
        
        # Define the system message
        system_message = """You are an expert job search assistant. Your task is to search for relevant job opportunities based on 
        the provided search criteria and filters. Use the search tool to find current job openings that match the specified requirements.

        Your response should be a JSON object containing:
        1. A list of job matches, where each match includes:
           - job_title: The title of the position
           - required_experience: Years of experience required (if available) in string format
           - technologies: List of key technologies and tools required (if available)
           - work_type: Whether remote, hybrid, or onsite
           - location: Job location
           - company: Name of the hiring company
           - required_qualifications: List of required skills and qualifications
           - application_link: Link to apply (if available)
           - job_description: Brief description of the role (if available)
           - salary_range: Salary information (if available)
        2. A search_summary field with a brief overview of the results

        Focus on finding current and relevant job postings that closely match the provided filters.
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

    def _build_search_criteria(self, filters: Dict) -> str:
        """Build search criteria message from filters"""
        criteria_parts = []
        
        if filters.get("job_title"):
            criteria_parts.append(f"Job Title: {filters['job_title']}")
        
        if filters.get("required_experience"):
            criteria_parts.append(f"Required Experience: {filters['required_experience']}")
        
        if filters.get("technologies"):
            tech_list = ", ".join(filters["technologies"])
            criteria_parts.append(f"Required Technologies: {tech_list}")
        
        if filters.get("work_type"):
            criteria_parts.append(f"Work Type: {filters['work_type']}")
        
        if filters.get("location"):
            criteria_parts.append(f"Location: {filters['location']}")
        
        if filters.get("company"):
            criteria_parts.append(f"Company: {filters['company']}")
        
        if filters.get("salary_range"):
            criteria_parts.append(f"Salary Range: {filters['salary_range']}")
        
        return "\n".join(criteria_parts)

    async def search_jobs(self, filters: Dict) -> JobMatchesResponse:
        """Search for relevant jobs based on provided filters"""
        try:
            # Create search criteria message
            search_criteria = self._build_search_criteria(filters)
            
            # Create message for the agent
            messages = [
                HumanMessage(content=f"""Please search for job opportunities matching the following criteria:

                {search_criteria}

                Find 3-5 relevant positions that best match these requirements. Format the response as a JSON object with 'matches' 
                and 'search_summary' fields. Each job match should include all required fields as specified in the system message.""")
            ]

            # Execute search
            response = await self.agent_executor.ainvoke({
                "input": messages[0].content,
                "chat_history": messages
            })

            # Parse response
            try:
                response_text = response["output"]
                try:
                    json_data = json.loads(response_text)
                except json.JSONDecodeError:
                    # Try to find JSON structure in text
                    import re
                    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                    if json_match:
                        json_data = json.loads(json_match.group())
                    else:
                        raise ValueError("No JSON structure found in response")

                # Parse into Pydantic model
                parsed_response = JobMatchesResponse(**json_data)
                return parsed_response

            except Exception as parsing_error:
                print(f"Error parsing response: {parsing_error}")
                print(f"Raw response: {response['output']}")
                return JobMatchesResponse(
                    matches=[],
                    search_summary=f"Error parsing job matches. Raw response: {response['output']}"
                )

        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error searching jobs: {str(e)}")

async def process_job_search(filters: Dict) -> Dict:
    """Process job search request and return matches"""
    try:
        processor = JobSearchProcessor()
        job_matches = await processor.search_jobs(filters)
        
        return {
            "job_matches": job_matches.dict()
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))