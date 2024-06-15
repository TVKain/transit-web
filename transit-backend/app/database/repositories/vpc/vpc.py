from app.database.adapter import DBAdapter

from app.database.models.vpc import VPCModel
from app.database.models.user_vpc import UserVPCModel


class VPCRepository:
    def __init__(self):
        self._db_adapter = DBAdapter()

    def get(self, ident) -> VPCModel:
        try:
            with self._db_adapter.get_session() as session:
                vpc_model = session.get_one(VPCModel, ident=ident)

                return VPCModel.model_validate(vpc_model)
        except Exception as e:
            print(e)

        return None

    def create(self, ident, region_id, router_id, network_id, name, cidr) -> VPCModel:
        try:
            with self._db_adapter.get_session() as session:
                vpc_model = VPCModel(
                    id=ident,
                    region_id=region_id,
                    router_id=router_id,
                    network_id=network_id,
                    name=name,
                    cidr=cidr,
                )

                session.add(vpc_model)
                session.commit()

                vpc = VPCModel.model_validate(vpc_model)
                return vpc
        except Exception as e:
            print(e)

        return None

    def add_user(self, vpc_id, user_id):
        try:
            with self._db_adapter.get_session() as session:
                user_vpc_model = UserVPCModel(vpc_id=vpc_id, user_id=user_id)

                session.add(user_vpc_model)
                session.commit()

        except Exception as e:
            print(e)

    def get_all_in_region_of_user(self, user_id, region_id):
        try:
            with self._db_adapter.get_session() as session:
                vpcs = (
                    session.query(VPCModel)
                    .join(UserVPCModel, VPCModel.id == UserVPCModel.vpc_id)
                    .filter(
                        UserVPCModel.user_id == user_id, VPCModel.region_id == region_id
                    )
                    .all()
                )

                return [VPCModel.model_validate(vpc) for vpc in vpcs]

        except Exception as e:
            print(e)
