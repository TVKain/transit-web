import axios from 'axios';

import { url } from '../config/constants';

import { Compute } from '../types/Compute';

interface CreateComputeRequest {
    subnet_id: string;
    vpc_id: string;
    name: string;
}

class ComputeApi {
    static async getAll(vpcId: string): Promise<Compute[]> {
        const result = await axios.get(`${url}/computes/`, {
            params: {
                vpc_id: vpcId,
            },
        });

        console.log(result.data.computes);
        return result.data.computes;
    }

    static async delete(computeId: string, vpcId: string): Promise<any> {
        const result = await axios.delete(`${url}/computes/${computeId}`, {
            params: {
                vpc_id: vpcId,
            },
        });

        return result.data;
    }

    static async create(data: CreateComputeRequest): Promise<any> {
        const result = await axios.post(`${url}/computes/`, data);

        return result.data;
    }
}

export { ComputeApi };
