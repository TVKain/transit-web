import { Address4 } from 'ip-address';

function isPrivateCIDR(cidr: string) {
    try {
        const addr = new Address4(cidr);
        return (
            addr.isInSubnet(new Address4('10.0.0.0/8')) ||
            addr.isInSubnet(new Address4('172.16.0.0/12')) ||
            addr.isInSubnet(new Address4('192.168.0.0/16'))
        );
    } catch (error) {
        return false;
    }
}

export default isPrivateCIDR;
