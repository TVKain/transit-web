

import { Navigate } from 'react-router-dom';

import Login from '../pages/login/Login'
import Home from '../pages/home/Home';

import ProtectedRoute from '../components/route/ProtectedRoute';
import PublicRoute from '../components/route/PublicRoute';
import Test from '../pages/test/Test';

import Layout from '../layout/Layout';
import VPC from '../pages/vpc/vpc/VPC';

import Compute from '../pages/compute/Compute';
import Subnet from '../pages/subnet/Subnet';
import { Box } from '@mui/material';
import RegionLoader from '../pages/loader/RegionLoader';
import VPCLoader from '../pages/loader/VPCLoader';
import TransitGateway from '../pages/transit_gateway/transit-gateway/TransitGateway';
import TransitGatewayAttachment from '../pages/transit_gateway/transit-gateway-vpc-attachment/TransitGatewayVPCAttachment';
import TransitGatewayRouteTable from '../pages/transit_gateway/transit-gateway-route-table/TransitGatewayRouteTable';
import VPCRouteTable from '../pages/vpc/vpc-route-table/VPCRouteTable';
import TransitGatewayPeeringAttachment from '../pages/transit_gateway/transit-gateway-peering-attachment/TransitGatewayPeeringAttachment';




const routes = [
    {
        path: '/',
        element: <Navigate to="/login" />
    },
    {
        path: '/login',
        element: <PublicRoute />,
        children: [
            {
                path: '',
                element: <Login />
            }
        ]
    },
    {
        path: '/region',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <RegionLoader />,
            }
        ]
    },
    {
        path: '/region/:regionId',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <VPCLoader />
            }
        ]
    },
    {
        path: '/region/:regionId/vpc',
        element: <ProtectedRoute />,
        children: [
            {
                path: ':vpcId?',
                element: <Box width="100vw" height="100vh"><Layout /></Box>,
                children: [
                    {
                        path: 'home',
                        element: <Home />
                    },
                    {
                        path: 'computes',
                        element: <Compute />
                    },
                    {
                        path: 'subnets',
                        element: <Subnet />
                    },
                    {
                        path: 'vpcs/vpcs',
                        element: <VPC />
                    },
                    {
                        path: 'vpcs/route-tables',
                        element: <VPCRouteTable />
                    },
                    {
                        path: 'transit-gateways/transit-gateways',
                        element: <TransitGateway />
                    },
                    {
                        path: 'transit-gateways/vpc-attachments',
                        element: <TransitGatewayAttachment />
                    },
                    {
                        path: 'transit-gateways/route-tables',
                        element: <TransitGatewayRouteTable />
                    },
                    {
                        path: 'transit-gateways/peering-attachments',
                        element: <TransitGatewayPeeringAttachment />
                    },
                    {
                        path: 'transit-gateways/transit-gateways/:transitGatewayId/route-table',
                        element: <TransitGatewayRouteTable />
                    }
                ]
            },
        ]
    },
    // {
    //     path: '/home',
    //     element: <ProtectedRoute />,
    //     children: [
    //         // {
    //         //     path: '',
    //         //     element: <Initialize />
    //         // },
    //         {
    //             path: '',
    //             element: <Layout />,
    //             loader: () => {
    //                 console.log("Hello")
    //             },
    //             children: [

    //                 {
    //                     path: ':regionId',
    //                     element: <Home />,
    //                     children: [
    //                         {
    //                             path: 'compute',
    //                             element: <Compute />
    //                         },
    //                         {
    //                             path: 'subnet',
    //                             element: <Subnet />
    //                         }
    //                     ]
    //                 },
    //             ],

    //         },

    //     ]
    // },
    {
        path: '/test',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <Test />
            }
        ]
    }
];

export default routes;