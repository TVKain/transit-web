import axios from 'axios';

import { url } from '../config/constants';

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    id: string;
    username: string;
}

interface GetRequest {
    id: string;
}

interface GetResponse {
    username: string;
}

class UserApi {
    static async login(data: LoginRequest): Promise<LoginResponse> {
        const result = await axios.post(`${url}/auth/`, data);

        return result.data;
    }

    static async get(data: GetRequest): Promise<GetResponse> {
        const result = await axios.get(`${url}/user/${data.id}`);

        return result.data;
    }
}

export { UserApi };
export type { LoginRequest };
