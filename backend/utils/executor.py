import subprocess
import tempfile
import os

def run_python_code(code: str) -> str:
    """Executes Python code safely in a temporary file and returns the output or error."""
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code)
            temp_path = temp_file.name

        result = subprocess.run(
            ["python", temp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        os.remove(temp_path)

        if result.returncode != 0:
            return f"ERROR:\n{result.stderr}"
        return f"SUCCESS:\n{result.stdout}"
    except subprocess.TimeoutExpired:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return "ERROR: Execution Timed Out (Infinite loop detected)."
    except Exception as e:
        return f"ERROR: System execution failed - {str(e)}"