from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session

from controller import (
    create_track,
    update_track,
    delete_track,
    get_all_tracks,
    get_track_by_id,
)
from model import SessionLocal
from schema.track_schema import TrackParams

router = APIRouter()  # インスタンス化が必要です


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/track")
def create_endpoint(params: TrackParams, db: Session = Depends(get_db)):
    return create_track(db, params)


@router.put("/track/{track_id}")
def update_endpoint(track_id: int, params: TrackParams, db: Session = Depends(get_db)):
    return update_track(db, track_id, params)


@router.delete("/track/{track_id}")
def delete_endpoint(track_id: int, db: Session = Depends(get_db)):
    return delete_track(db, track_id)


@router.get("/track")
def get_all_tracks_endpoint(db: Session = Depends(get_db)):
    return get_all_tracks(db)


@router.get("/track/{track_id}")
def get_track_by_id_endpoint(track_id: int, db: Session = Depends(get_db)):
    return get_track_by_id(db, track_id)
