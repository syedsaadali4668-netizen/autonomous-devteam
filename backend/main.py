from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import uvicorn

# Yeh line miss ho gayi thi:
app = FastAPI()

# Ab middleware theek se attach ho jayega:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel samet sab ko allow karega
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)