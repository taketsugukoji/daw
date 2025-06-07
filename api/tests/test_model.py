import os
import tempfile
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.model import Base, create, update, delete, get_all, get_by_id


@pytest.fixture(scope="function")
def db():
    # テスト用の一時DBを作成
    db_fd, db_path = tempfile.mkstemp()
    engine = create_engine(f"sqlite:///{db_path}")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    os.close(db_fd)
    os.unlink(db_path)


def test_create_and_get_by_id(db):
    track = create(db, "test", '{"kick": true}')
    assert track is not None
    fetched = get_by_id(db, track.id)
    assert fetched is not None
    assert fetched.name == "test"


def test_update(db):
    track = create(db, "old", '{"kick": false}')
    updated = update(db, track.id, "new", '{"kick": true}')
    assert updated.name == "new"
    assert updated.instruments == '{"kick": true}'


def test_delete(db):
    track = create(db, "del", '{"kick": false}')
    deleted = delete(db, track.id)
    assert deleted is not None
    assert get_by_id(db, track.id) is None


def test_get_all(db):
    create(db, "a", '{"a": 1}')
    create(db, "b", '{"b": 2}')
    all_tracks = get_all(db)
    assert len(all_tracks) == 2
