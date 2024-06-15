import axios from 'axios';

import { url } from '../config/constants';

import { Subnet } from '../types/Subnet';

interface CreateSubnetRequest {
    vpc_id: string;
    network_address: string;
}

class SubnetApi {
    static async getAll(vpcId: string): Promise<Subnet[]> {
        const result = await axios.get(`${url}/subnets/`, {
            params: {
                vpc_id: vpcId,
            },
        });
        return result.data.subnets;
    }

    static async create(data: CreateSubnetRequest): Promise<Subnet> {
        const result = await axios.post(`${url}/subnets/`, data);

        return result.data;
    }

    static async delete(subnetId: string, vpcId: string): Promise<any> {
        const result = await axios.delete(`${url}/subnets/${subnetId}`, {
            params: {
                vpc_id: vpcId,
            },
        });

        return result.data;
    }
}

export { SubnetApi };
