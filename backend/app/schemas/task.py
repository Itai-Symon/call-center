from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    name: str

class TaskCreate(TaskBase):
    call_id: Optional[int] = None

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    call_id: Optional[int] = None

class TaskInDB(TaskBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    call_id: Optional[int] = None

    class Config:
        orm_mode = True

class Task(TaskInDB):
    pass 