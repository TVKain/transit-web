import axios from 'axios'

import { VPCTransitGatewayRoute } from '../../types/Transit'
import chooseRegion from '../../utils/chooseRegion'



class VPCTransitGatewayRouteApi {
    static async getAll(regionId: string, vpcId: string) {
        const result = await axios.get<VPCTransitGatewayRoute[]>(`${chooseRegion(regionId)}/vpc_transit_gateway_routes/`, {
            params: {
                vpc_id: vpcId
            },
        })
        return result.data 
    }

    static async create(regionId: string, data: { 
        vpc_id: string, 
        destination_cidr: string, 
        transit_gateway_vpc_attachment_id: string
    }) {
        const result = await axios.post(`${chooseRegion(regionId)}/vpc_transit_gateway_routes/`, data)

        return result.data
    }

    static async delete(regionId: string, routeId: string) {
        const result = await axios.delete(`${chooseRegion(regionId)}/vpc_transit_gateway_routes/${routeId}`)

        return result.data
    }

}

export { VPCTransitGatewayRouteApi }