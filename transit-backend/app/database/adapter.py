import os

from contextlib import contextmanager

from sqlmodel import create_engine

from sqlalchemy.orm import sessionmaker


class DBAdapter:
    _engine = None
    _session = None

    def __init__(self):

        if self._engine is None:
            self._engine = create_engine(os.getenv("DATABASE_URL"))
            self._session = sessionmaker(bind=self._engine)

    @contextmanager
    def get_session(self):
        session = self._session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
