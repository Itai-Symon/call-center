from pydantic import BaseModel
from typing import List
from .tag import Tag

class CallBase(BaseModel):
    title: str

class CallCreate(CallBase):
    tag_ids: List[int] = []

class Call(CallBase):
    id: int
    tags: List[Tag] = []

    class Config:
        orm_mode = True 