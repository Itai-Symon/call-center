from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
from routers import tags, calls, tasks
import os

database.create_tables()

app = FastAPI(
    title="Call Center API",
    description="API for managing call center operations",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tags.router)
app.include_router(calls.router)
app.include_router(tasks.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Call Center API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/test")
async def test():
    return {
        "status": "success",
        "message": "API is working correctly"
    }