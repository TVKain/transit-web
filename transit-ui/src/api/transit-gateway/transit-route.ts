import axios from 'axios'


import {  TransitGatewayRoute } from '../../types/Transit'
import chooseRegion from '../../utils/chooseRegion'


class TransitGatewayRouteApi {
    static async getAll(regionId: string, transit_gateway_id: string) {
        
        const vpcRouteResponse = await axios.get<TransitGatewayRoute[]>(`${chooseRegion(regionId)}/transit_gateway_vpc_routes/`, {
            params: {
                transit_gateway_id,
            },
        })

        let vpcRoutes = vpcRouteResponse.data.map((route) => {
            return {
                ...route,
            type: 'VPC',
        }})

        return vpcRoutes
    }

    static async createVPCRoute(regionId: string, data: {
        destination_cidr: string,
        vpc_attachment_id: string
    }) {

        const result = await axios.post(`${chooseRegion(regionId)}/transit_gateway_vpc_routes/`, data)

        return result.data
    }

    static async deleteVPCRoute(regionId: string, routeId: string) {
        const result = await axios.delete(`${chooseRegion(regionId)}/transit_gateway_vpc_routes/${routeId}`)

        return result.data
    }

    static async create(regionId: string, data: { name?: string }) {


        const result = await axios.post(`${chooseRegion(regionId)}/transit_gateways/`, data)

        return result.data
    }


}

export { TransitGatewayRouteApi }