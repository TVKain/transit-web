import axios from 'axios';

import { url } from '../config/constants';

import { VPC } from '../types/VPC';

interface CreateVPCRequest {
    user_id: string;
    region_id: string;
    name: string;
    cidr: string;
}

class VPCApi {
    static async getAll(userId: string, regionId: string): Promise<VPC[]> {
        const result = await axios.get(`${url}/vpcs/`, {
            params: {
                user_id: userId,
                region_id: regionId,
            },
        });
        return result.data;
    }
    static async create(data: CreateVPCRequest): Promise<VPC> {
        const result = await axios.post(`${url}/vpcs/`, data);

        return result.data;
    }

    static async get(vpcId: string): Promise<VPC> {
        const result = await axios.get(`${url}/vpcs/${vpcId}`);

        return result.data;
    }
}

export { VPCApi };
