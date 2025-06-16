from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from .tags import Tag
from schemas import calls
from models.call import Call

router = APIRouter(
    prefix="/calls",
    tags=["calls"]
)

@router.post("/", response_model=calls.Call)
def create_call(call: calls.CallCreate, db: Session = Depends(get_db)):
    # Create the call using the SQLAlchemy model
    db_call = Call(title=call.title)
    db.add(db_call)
    db.commit()
    db.refresh(db_call)

    # Add tags
    if call.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(call.tag_ids)).all()
        db_call.tags.extend(tags)

    db.commit()
    db.refresh(db_call)
    return db_call

@router.get("/", response_model=List[calls.Call])
def read_calls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    calls = db.query(Call).offset(skip).limit(limit).all()
    return calls

@router.get("/{call_id}", response_model=calls.Call)
def read_call(call_id: int, db: Session = Depends(get_db)):
    db_call = db.query(Call).filter(Call.id == call_id).first()
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    return db_call

@router.put("/{call_id}", response_model=calls.Call)
def update_call(call_id: int, call: calls.CallCreate, db: Session = Depends(get_db)):
    db_call = db.query(Call).filter(Call.id == call_id).first()
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")

    # Update basic info
    db_call.title = call.title

    # Update tags
    db_call.tags = []
    if call.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(call.tag_ids)).all()
        db_call.tags.extend(tags)

    db.commit()
    db.refresh(db_call)
    return db_call

@router.delete("/{call_id}")
def delete_call(call_id: int, db: Session = Depends(get_db)):
    db_call = db.query(Call).filter(Call.id == call_id).first()
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    
    db.delete(db_call)
    db.commit()
    return {"message": "Call deleted successfully"}
