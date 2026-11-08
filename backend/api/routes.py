from fastapi import APIRouter
from pydantic import BaseModel
from agents.graph import app_graph

router = APIRouter()

class CodeRequest(BaseModel):
    code: str
    language: str

@router.post("/optimize")
async def optimize_code(request: CodeRequest):
    initial_state = {
        "original_code": request.code,
        "current_code": request.code,
        "language": request.language,
        "feedback": "",
        "execution_logs": "",
        "iterations": 0,
        "status": "Initializing workflow..."
    }
    
    # Execute the LangGraph workflow
    result = app_graph.invoke(initial_state)
    
    return {
        "optimized_code": result["current_code"],
        "feedback": result["feedback"],
        "logs": result["execution_logs"],
        "iterations": result["iterations"]
    }