from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

Base = declarative_base()

class Track(Base):
    __tablename__ = 'tracks'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    pattern = Column(String)

    def __init__(self, name: str, pattern: str):
        self.name = name
        self.pattern = pattern

DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create(db: Session, name: str, pattern: str) -> Optional[Track]:
    try:
        target = Track(name=name, pattern=pattern)
        db.add(target)
        db.commit()
        db.refresh(target)
        return target
    except SQLAlchemyError:
        db.rollback()
        return None

def update(db: Session, id: int, name: str, pattern: str) -> Optional[Track]:
    try:
        db_track = db.query(Track).filter(Track.id == id).first()
        if db_track:
            db_track.name = name
            db_track.pattern = pattern
            db.commit()
            db.refresh(db_track)
        return db_track
    except SQLAlchemyError:
        db.rollback()
        return None

def delete(db: Session, id: int) -> Optional[Track]:
    try:
        db_track = db.query(Track).filter(Track.id == id).first()
        if db_track:
            db.delete(db_track)
            db.commit()
        return db_track
    except SQLAlchemyError:
        db.rollback()
        return None

def get_all(db: Session) -> List[Track]:
    try:
        return db.query(Track).all()
    except SQLAlchemyError:
        return []

def get_by_id(db: Session, id: int) -> Optional[Track]:
    try:
        return db.query(Track).filter(Track.id == id).first()
    except SQLAlchemyError:
        return None