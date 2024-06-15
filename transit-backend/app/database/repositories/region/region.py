from app.database.adapter import DBAdapter

from app.database.models.region import RegionModel


class RegionRepository:
    def __init__(self):
        self._db_adapter = DBAdapter()

    def get_all(self) -> list[RegionModel]:
        try:
            with self._db_adapter.get_session() as session:
                regions_db = session.query(RegionModel).all()

                regions = [RegionModel.model_validate(region) for region in regions_db]
        except Exception as e:
            print(e)

        return regions

    def get(self, ident) -> RegionModel:
        try:
            with self._db_adapter.get_session() as session:
                region_model = session.get_one(RegionModel, ident=ident)
                region = RegionModel.model_validate(region_model)
        except Exception as e:
            print(e)

        return region

    def create(self, id, auth_url) -> RegionModel:
        try:
            with self._db_adapter.get_session() as session:

                region_model = RegionModel(id=id, auth_url=auth_url)

                session.add(region_model)
                session.commit()

                region = RegionModel.model_validate(region_model)

        except Exception as e:
            print(e)
        return region
