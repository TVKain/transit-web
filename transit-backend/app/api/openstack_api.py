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
            auth_url=auth_url,
            project_name=project_name,
            username=username,
            password=password,
            region_name=region_name,
            project_domain_name=project_domain_name,
            user_domain_name=user_domain_name,
        )
