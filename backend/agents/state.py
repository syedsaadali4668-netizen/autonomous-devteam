from typing import TypedDict

class GraphState(TypedDict):
    original_code: str
    current_code: str
    language: str
    feedback: str
    execution_logs: str
    iterations: int
    status: str