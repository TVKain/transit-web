import os

import openstack


class OpenStackAuth:
    """
    Return openstack client object

    """

    @staticmethod
    def get_connection(auth_url, region_name, project_name=os.getenv("PROJECT_NAME")):
        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")

        project_domain_name = os.getenv("PROJECT_DOMAIN_NAME")
        user_domain_name = os.getenv("USER_DOMAIN_NAME")

        return openstack.connect(
            AUTH_URL=auth_url,
            PROJECT_NAME=project_name,
            USERNAME=username,
            PASSWORD=password,
            region_name=region_name,
            PROJECT_DOMAIN_NAME=project_domain_name,
            USER_DOMAIN_NAME=user_domain_name,
        )
