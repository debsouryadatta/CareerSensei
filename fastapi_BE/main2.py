# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Optional, Union
# import base64
# from io import BytesIO
# from PIL import Image
# import os
# from dotenv import load_dotenv

# # LangChain imports
# from langchain_openai import ChatOpenAI
# from langchain_core.messages import HumanMessage

# # Load environment variables
# load_dotenv()

# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class ImageAnalyzer:
#     def __init__(self, use_sambanova: bool = False):
#         """Initialize the image analyzer with option to use Sambanova or OpenAI."""
#         if use_sambanova:
#             self.chat_model = ChatOpenAI(
#                 api_key=os.getenv("SAMBANOVA_API_KEY"),
#                 base_url="https://api.sambanova.ai/v1",
#                 model="Llama-3.2-90B-Vision-Instruct",
#                 max_tokens=1000
#             )
#         else:
#             self.chat_model = ChatOpenAI(
#                 api_key=os.getenv("OPENAI_API_KEY"),
#                 model="gpt-4-vision-preview",
#                 max_tokens=1000
#             )

#     def _process_image_bytes(self, image_bytes: bytes) -> str:
#         """Process image from bytes and convert to base64."""
#         return base64.b64encode(image_bytes).decode('utf-8')

#     async def analyze_image(
#         self, 
#         image_bytes: bytes, 
#         prompt: str = "What text can you see in this image? Extract and format it clearly."
#     ) -> str:
#         """
#         Analyze an image using vision model and return the extracted text/analysis.
        
#         Args:
#             image_bytes: Raw bytes of the image
#             prompt: Custom prompt for the vision model
            
#         Returns:
#             str: Analysis result from the vision model
#         """
#         try:
#             # Process image bytes to base64
#             image_data = self._process_image_bytes(image_bytes)

#             # Create message with image
#             message = HumanMessage(
#                 content=[
#                     {
#                         "type": "text",
#                         "text": prompt
#                     },
#                     {
#                         "type": "image_url",
#                         "image_url": {
#                             "url": f"data:image/jpeg;base64,{image_data}",
#                             "detail": "high"
#                         }
#                     }
#                 ]
#             )

#             # Get response from vision model
#             response = await self.chat_model.ainvoke([message])
#             return response.content

#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

# # Initialize the image analyzer
# analyzer = ImageAnalyzer(use_sambanova=True)  # Set to True to use Sambanova

# @app.post("/analyze-image")
# async def analyze_image_endpoint(
#     file: UploadFile = File(...),
#     prompt: Optional[str] = None
# ):
#     """
#     Endpoint to analyze an uploaded image using vision models.
    
#     Args:
#         file: The image file to analyze
#         prompt: Optional custom prompt for the vision model
    
#     Returns:
#         dict: Analysis results
#     """
#     try:
#         # Read image content
#         image_content = await file.read()
        
#         # Use default prompt if none provided
#         if not prompt:
#             prompt = "What text can you see in this image? Extract and format it clearly."

#         # Analyze image
#         result = await analyzer.analyze_image(image_content, prompt)
        
#         return {
#             "success": True,
#             "analysis": result
#         }
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)