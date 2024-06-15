from app.database.adapter import DBAdapter

from app.database.models.user import UserModel


class UserRepository:
    def __init__(self):
        self._db_adapter = DBAdapter()

    def get_all(self) -> list[UserModel]:
        try:
            with self._db_adapter.get_session() as session:
                users = session.query(UserModel).all()

        except Exception as e:
            print(e)

        return users

    def get(self, ident) -> UserModel:
        try:
            with self._db_adapter.get_session() as session:
                user_db = session.get_one(UserModel, ident=ident)

                user = UserModel.model_validate(user_db)

                return user
        except Exception as e:
            print(e)

        return None

    def create(self, username, password) -> UserModel:
        try:
            with self._db_adapter.get_session() as session:

                user_model = UserModel(username=username, password=password)

                session.add(user_model)
                session.commit()

                user = UserModel.model_validate(user_model)

        except Exception as e:
            print(e)
        return user

    def get_by_username(self, username) -> UserModel:
        try:
            with self._db_adapter.get_session() as session:
                user_db = session.query(UserModel).filter_by(username=username).first()

                user = UserModel.model_validate(user_db)

                return user

        except Exception as e:
            print(e)

        return None
