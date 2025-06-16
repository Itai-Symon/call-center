from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from database import Base

class TaskStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Foreign keys
    call_id = Column(Integer, ForeignKey("calls.id"), nullable=True)  # Nullable for suggested tasks
    
    # Relationships
    call = relationship("Call", back_populates="tasks")
    
    def __repr__(self):
        return f"<Task(id='{self.id}', name='{self.name}', status='{self.status}')>" 