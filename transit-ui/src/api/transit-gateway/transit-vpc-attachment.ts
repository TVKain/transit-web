import axios from 'axios'


import { TransitGatewayVPCAttachment } from '../../types/Transit'
import chooseRegion from '../../utils/chooseRegion'



class TransitGatewayVPCAttachmentApi {
    static async getAll(regionId: string) {

        const result = await axios.get<TransitGatewayVPCAttachment[]>(`${chooseRegion(regionId)}/transit_gateway_vpc_attachments/`)
        return result.data 
    }

    static async create(regionId: string, data: {
        name: string, 
        transit_gateway_id: string,
        vpc_id: string,
        vpc_router_id: string,
        vpc_cidr: string
      }) {


        const result = await axios.post(`${chooseRegion(regionId)}/transit_gateway_vpc_attachments/`, data)

   
        return result.data
    }

    static async getAllByTransitGateway(regionId: string, transitGatewayId: string) {
        const result = await axios.get<TransitGatewayVPCAttachment[]>(`${chooseRegion(regionId)}/transit_gateway_vpc_attachments/`, {
            params: {
                transit_gateway_id: transitGatewayId
            }
        })


        return result.data 
    }
    
    static async delete(regionId: string, attachmentId: string) {
        const result = await axios.delete(`${chooseRegion(regionId)}/transit_gateway_vpc_attachments/${attachmentId}`)

        return result.data
    }


}

export { TransitGatewayVPCAttachmentApi }