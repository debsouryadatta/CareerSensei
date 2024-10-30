import os
import sys

# Add the root directory of your project to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import traceback
from typing import Dict
from crewai import Agent, Task, Crew, Process
from crewai_tools import (
    PDFSearchTool,
    FirecrawlSearchTool,
    FirecrawlScrapeWebsiteTool,
    ScrapeElementFromWebsiteTool
)
from langchain_openai import ChatOpenAI
from core.config import settings
from dotenv import load_dotenv

load_dotenv()

class ResumeJobFinder:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.llm = ChatOpenAI(
            api_key=settings.sambanova_api_key,
            base_url="https://api.sambanova.ai/v1",
            model="Meta-Llama-3.1-8B-Instruct",
        )
        # Initialize CrewAI tools
        self.pdf_tool = PDFSearchTool()
        self.search_tool = FirecrawlSearchTool()
        self.scrape_tool = FirecrawlScrapeWebsiteTool()
        self.element_scraper = ScrapeElementFromWebsiteTool()

    def create_agents(self) -> Dict[str, Agent]:
        """Create and return the agents needed for the crew."""
        
        # Resume Parser Agent
        parser = Agent(
            role='Resume Parser',
            goal='Extract and structure key information from resume PDF',
            backstory="""You are an expert at analyzing resumes and extracting 
                        key information like skills, experience, and qualifications.
                        You use advanced PDF processing tools to ensure accurate extraction.""",
            llm=self.llm,
            tools=[self.pdf_tool],
            verbose=True,
            allow_delegation=False
        )

        # Skills Analyzer Agent
        analyzer = Agent(
            role='Skills Analyzer',
            goal='Analyze resume content and identify key job-relevant skills and keywords',
            backstory="""You are a skilled professional who understands 
                        industry requirements and can identify the most relevant 
                        skills and keywords for job searching.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

        # Job Search Agent
        job_searcher = Agent(
            role='Job Search Specialist',
            goal='Find and analyze relevant job postings based on candidate skills',
            backstory="""You are an expert at matching candidate profiles 
                        with job opportunities. You know how to search and 
                        identify the most relevant job postings using web crawling
                        and scraping tools to gather comprehensive job information.""",
            llm=self.llm,
            tools=[
                self.search_tool,
                self.scrape_tool,
                self.element_scraper
            ],
            verbose=True,
            allow_delegation=False
        )

        return {
            'parser': parser,
            'analyzer': analyzer,
            'searcher': job_searcher
        }

    def create_tasks(self, agents: Dict[str, Agent]) -> list[Task]:
        """Create and return the tasks for the crew."""
        
        # Task 1: Parse Resume
        parse_task = Task(
            description=f"""Use the PDFSearchTool to read and analyze the resume at: {self.pdf_path}
                          
                          Extract and structure the following information:
                          1. Professional Summary
                          2. Skills
                          3. Work Experience
                          4. Education
                          5. Certifications (if any)
                          
                          Use the tool's search capabilities to ensure all sections 
                          are properly identified and extracted.""",
            agent=agents['parser'],
            expected_output="A structured JSON containing the parsed resume information"
        )

        # Task 2: Analyze Skills
        analyze_task = Task(
            description="""Using the parsed resume information from the previous task:
                          1. Identify primary technical skills
                          2. Identify soft skills
                          3. Determine industry-specific keywords
                          4. Suggest job titles that match the profile
                          5. Create a list of search terms for job hunting
                          
                          Format the output as a structured list of categories.""",
            agent=agents['analyzer'],
            expected_output="A list of key skills, keywords, and suggested job titles"
        )

        # Task 3: Search Jobs
        search_task = Task(
            description="""Using the analyzed skills and keywords from the previous task:
                          1. Use FirecrawlSearchTool to find relevant job postings
                          2. Use FirecrawlScrapeWebsiteTool to get detailed job descriptions
                          3. Use ScrapeElementFromWebsiteTool to extract specific job requirements
                          4. Compile a list of top 5 job matches
                          5. Include job title, company, location, and requirements
                          6. Add a matching score and explanation for each job
                          
                          For each job posting:
                          - Scrape the full job description
                          - Extract key requirements
                          - Compare with candidate's profile
                          - Calculate a matching percentage""",
            agent=agents['searcher'],
            expected_output="A detailed list of 5 relevant job opportunities with matching scores"
        )

        return [parse_task, analyze_task, search_task]

    def run(self) -> str:
        """Execute the resume analysis and job search process."""
        # Create agents and tasks
        agents = self.create_agents()
        tasks = self.create_tasks(agents)
        
        # Create and run the crew
        crew = Crew(
            agents=list(agents.values()),
            tasks=tasks,
            verbose=True,
            process=Process.sequential  # Tasks must be executed in order
        )
        
        # Execute the crew and return results
        result = crew.kickoff()
        return result

# Usage example
if __name__ == "__main__":
    try:
        resume_finder = ResumeJobFinder("path_to_your_resume.pdf")
        results = resume_finder.run()
        print(results)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Traceback: ", traceback.format_exc())