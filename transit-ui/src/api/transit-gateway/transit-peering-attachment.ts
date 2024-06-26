import axios from 'axios'


import {    TransitGatewayPeeringAttachment } from '../../types/Transit'
import chooseRegion from '../../utils/chooseRegion'

import { url } from '../../config/constants'

interface CreateTransitGatewayPeeringAttachmentRequest {
    name: string; 
    transit_gateway_id: string; 
    region_id: string;
    remote_region_id: string;
    remote_transit_gateway_id: string;
}


class TransitGatewayPeeringApi {
    static async getAll(regionId: string) {
        const result = await axios.get<TransitGatewayPeeringAttachment[]>(`${chooseRegion(regionId)}/transit_gateway_peering_attachments/`)
        return result.data 
    }


    static async create(data: CreateTransitGatewayPeeringAttachmentRequest) {
        const result = await axios.post(`${url}/transit_gateway_peering_attachments/`, data)
        return result.data 
    }

    static async delete(regionId: string, transit_gateway_peering_attachment_id: string) {
        const result = await axios.delete(`${url}/transit_gateway_peering_attachments/${transit_gateway_peering_attachment_id}`, {
            params: {
                region_id: regionId,
            }
        })

        return result.data 
    }
}

export { TransitGatewayPeeringApi }