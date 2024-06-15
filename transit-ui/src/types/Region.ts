import { VPC } from './VPC';
interface Region {
    id: string;
    vpcs: [VPC] | [];
}

export type { Region, VPC };
