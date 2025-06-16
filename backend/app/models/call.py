from sqlalchemy import Column, String, DateTime, Integer, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Association table for many-to-many relationship between calls and tags
call_tags = Table(
    "call_tags",
    Base.metadata,
    Column("call_id", Integer, ForeignKey("calls.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True)
)

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    tags = relationship("Tag", secondary=call_tags, back_populates="calls")
