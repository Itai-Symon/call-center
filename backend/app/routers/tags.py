from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.tag import Tag
from schemas.tag import Tag as TagSchema, TagCreate, TagUpdate

router = APIRouter(
    prefix="/tags",
    tags=["tags"]
)

@router.get("/", response_model=List[TagSchema])
def get_all_tags(db: Session = Depends(get_db)):
    """Get all tags"""
    tags = db.query(Tag).all()
    return tags

@router.get("/{tag_id}", response_model=TagSchema)
def get_tag(tag_id: str, db: Session = Depends(get_db)):
    """Get a specific tag by ID"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@router.post("/", response_model=TagSchema)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag"""
    # Check if tag with same name already exists
    existing_tag = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag with this name already exists")
    
    db_tag = Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.put("/{tag_id}", response_model=TagSchema)
def update_tag(tag_id: str, tag_update: TagUpdate, db: Session = Depends(get_db)):
    """Update a tag"""
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    if tag_update.name:
        # Check if another tag with same name exists
        existing_tag = db.query(Tag).filter(Tag.name == tag_update.name, Tag.id != tag_id).first()
        if existing_tag:
            raise HTTPException(status_code=400, detail="Tag with this name already exists")
        db_tag.name = tag_update.name
    
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.delete("/{tag_id}")
def delete_tag(tag_id: str, db: Session = Depends(get_db)):
    """Delete a tag"""
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if db_tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(db_tag)
    db.commit()
    return {"message": "Tag deleted successfully"}