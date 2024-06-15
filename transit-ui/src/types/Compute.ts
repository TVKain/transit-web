interface IPAddress {
    ip_address: string;
    subnet: string;
}

interface Compute {
    id: string;
    name: string;
    ip_addresses: IPAddress[];
    status: string;
    console_url: string;
}

export type { Compute };
