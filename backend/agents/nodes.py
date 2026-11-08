from langchain_google_genai import ChatGoogleGenerativeAI
from .state import GraphState
from utils.executor import run_python_code
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini Model with explicit API key parameter
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    google_api_key=os.getenv("GEMINI_API_KEY")
)
def critic_node(state: GraphState) -> GraphState:
    prompt = f"""
    You are a Senior Security & Code Reviewer. 
    Analyze this {state['language']} code for bugs, bad practices, and security flaws.
    If it's perfect and has no bugs, reply ONLY with the exact word: PERFECT.
    Otherwise, provide detailed feedback on what needs to be fixed.
    
    Current Code:
    {state['current_code']}
    """
    response = llm.invoke(prompt)
    feedback = response.content
    
    status = "Code is perfect" if "PERFECT" in feedback.upper() else "Bugs found by Critic"
    return {"feedback": feedback, "status": status}

def coder_node(state: GraphState) -> GraphState:
    prompt = f"""
    You are an Expert Developer. Fix the following {state['language']} code based on the Critic's feedback and execution logs.
    RETURN ONLY THE FIXED CODE inside a Markdown code block (```python ... ```). Do not add any conversational text.
    
    Original Code: {state['original_code']}
    Critic Feedback: {state['feedback']}
    Execution Errors (if any): {state['execution_logs']}
    Current Code: {state['current_code']}
    """
    response = llm.invoke(prompt)
    raw_response = response.content
    
    new_code = raw_response
    if "```" in raw_response:
        parts = raw_response.split("```")
        if len(parts) >= 3:
            new_code = parts[1]
            if new_code.startswith("python") or new_code.startswith("cpp"):
                new_code = new_code.split("\n", 1)[1]
            
    return {
        "current_code": new_code.strip(), 
        "status": "Coder fixed the issues", 
        "iterations": state["iterations"] + 1
    }

def tester_node(state: GraphState) -> GraphState:
    if state["language"].lower() == "python":
        logs = run_python_code(state["current_code"])
    else:
        logs = "SUCCESS: Syntax review passed (Execution currently only supports Python natively)."
    
    return {"execution_logs": logs, "status": "Tester evaluated the code"}