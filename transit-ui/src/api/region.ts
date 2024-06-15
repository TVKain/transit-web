import axios from 'axios';

import { url } from '../config/constants';

import { Region } from '../types/Region';

// {
//     "regions": [
//       {
//         "id": "RegionOne",
//         "auth_url": "http://127.0.0.1:5000/v3",
//         "vpcs": [
//           {
//             "id": "d4794f8589744172b656dcc36ae7538f",
//             "name": "next"
//           },
//           {
//             "id": "db7f74ad0bed4699ae459542b77c5f7e",
//             "name": "string"
//           }
//         ]
//       },
//       {
//         "id": "RegionTwo",
//         "auth_url": "http://127.0.0.1:5000/v3",
//         "vpcs": []
//       }
//     ]
//   }

class RegionApi {
    static async getAll(userId: string): Promise<Region[]> {
        const result = await axios.get(`${url}/regions/${userId}`, {
            timeout: 1000,
        });

        return result.data.regions;
    }
}

export { RegionApi };
