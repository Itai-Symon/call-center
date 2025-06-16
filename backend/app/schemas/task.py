from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    name: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None

class TaskInDB(TaskBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    call_id: Optional[int] = None

    class Config:
        from_attributes = True

class Task(TaskInDB):
    pass 