import json

from sqlalchemy.orm import Session
from api.model import create, update, delete, get_all, get_by_id
from api.schema.track_schema import TrackParams


def create_track(db: Session, params: TrackParams):
    name = params.name
    # sqlite では配列での保存が対応されていない。instruments が検索等で使用される可能性はないため str で保存
    instruments_string = json.dumps(params.instruments.model_dump())
    return create(db, name, instruments_string)


def update_track(db: Session, id: int, params: TrackParams):
    name = params.name
    # sqlite では配列での保存が対応されていない。instruments が検索等で使用される可能性はないため str で保存
    instruments_string = json.dumps(params.instruments.model_dump())
    return update(db, id, name, instruments_string)


def delete_track(db: Session, id: int):
    return delete(db, id)


def get_all_tracks(db: Session):
    tracks = get_all(db)
    return [track.to_dict() for track in tracks]


def get_track_by_id(db: Session, id: int):
    track = get_by_id(db, id)
    return track.to_dict() if track else None
