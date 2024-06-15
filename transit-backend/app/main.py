import os

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.routers.main import api_router

app = FastAPI()

# Define allowed origins
origins = [os.getenv("ALLOWED_ORIGIN")]

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(api_router)
