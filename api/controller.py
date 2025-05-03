import json

from sqlalchemy.orm import Session
from model import create,update,delete,get_all,get_by_id
from schema.track_schema import TrackParams


def create_track(db:Session,params:TrackParams):
    name = params.name
    # sqlite では配列での保存が対応されていない。pattern が検索等で使用される可能性はないため str で保存
    pattern_string = json.dumps(params.pattern.model_dump())
    return create(db,name,pattern_string)

def update_track(db:Session,id:int,params:TrackParams):
    name = params.name
    # sqlite では配列での保存が対応されていない。pattern が検索等で使用される可能性はないため str で保存
    pattern_string = json.dumps(params.pattern.model_dump())
    return update(db,id,name,pattern_string)

def delete_track(db:Session,id:int):
    return delete(db,id)

def get_all_tracks(db:Session):
    return get_all(db)

def get_track_by_id(db:Session,id:int):
    return get_by_id(db,id)