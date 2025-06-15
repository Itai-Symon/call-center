from fastapi import FastAPI
import database
from routers import tags

database.create_tables()

app = FastAPI(
    title="Call Center API",
    description="API for managing call center operations",
    version="1.0.0"
)


# Include routers
app.include_router(tags.router)

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