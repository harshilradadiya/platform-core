"""Main entrypoint wrapper for MediaFlow backend.
Allows running with either `uvicorn main:app` or `uvicorn app.main:app`.
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=False)
