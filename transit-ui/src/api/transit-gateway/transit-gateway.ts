import axios from 'axios'


import { TransitGateway } from '../../types/Transit'
import chooseRegion from '../../utils/chooseRegion'


class TransitGatewayApi {
    static async getAll(regionId: string) {
        

        const result = await axios.get<TransitGateway[]>(`${chooseRegion(regionId)}/transit_gateways/`)
        return result.data 
    }

    static async create(regionId: string, data: { name?: string }) {


        const result = await axios.post(`${chooseRegion(regionId)}/transit_gateways/`, data)

        return result.data
    }

    static async delete(regionId: string, transitGatewayId: string) {
        const result = await axios.delete(`${chooseRegion(regionId)}/transit_gateways/${transitGatewayId}/`)

        return result.data
    }

}

export { TransitGatewayApi }