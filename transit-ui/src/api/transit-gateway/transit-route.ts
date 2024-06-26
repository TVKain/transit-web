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

        const routeResponse = await axios.get<TransitGatewayRoute[]>(`${chooseRegion(regionId)}/transit_gateway_peering_routes/`, {
            params: {
                transit_gateway_id,
            },
        })

        let peeringRoutes = routeResponse.data.map((route) => {
            
            return {
            id: route.id,
            status: route.status,
            // @ts-ignore
            destination: route.destination_cidr as string,
            // @ts-ignore
            target: route.transit_gateway_peering_attachment_id as string, 
            type: 'PEERING',
        }})


        return vpcRoutes.concat(peeringRoutes)
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

    static async createPeeringRoute(regionId: string, data: {
        destination_cidr: string,
        transit_gateway_peering_attachment_id: string
    }) {
        const result = await axios.post(`${chooseRegion(regionId)}/transit_gateway_peering_routes/`, data)

        return result.data
    }

    static async deletePeeringRoute(regionId: string, routeId: string) {
        const result = await axios.delete(`${chooseRegion(regionId)}/transit_gateway_peering_routes/${routeId}`)

        return result.data
    }


}

export { TransitGatewayRouteApi }