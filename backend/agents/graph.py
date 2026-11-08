from langgraph.graph import StateGraph, END
from typing import Literal
from .state import GraphState
from .nodes import critic_node, coder_node, tester_node

def routing_logic(state: GraphState) -> Literal["coder_node", "__end__"]:
    # If there are errors and we haven't hit the iteration limit, retry coding
    if "ERROR:" in state["execution_logs"] and state["iterations"] < 3:
        return "coder_node"
    return "__end__"

# Build the Graph
workflow = StateGraph(GraphState)

workflow.add_node("critic_node", critic_node)
workflow.add_node("coder_node", coder_node)
workflow.add_node("tester_node", tester_node)

workflow.set_entry_point("critic_node")
workflow.add_edge("critic_node", "coder_node")
workflow.add_edge("coder_node", "tester_node")
workflow.add_conditional_edges("tester_node", routing_logic)

app_graph = workflow.compile()