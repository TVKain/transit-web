

import { Navigate } from 'react-router-dom';

import Login from '../pages/login/Login'
import Home from '../pages/home/Home';

import ProtectedRoute from '../components/route/ProtectedRoute';
import PublicRoute from '../components/route/PublicRoute';
import Test from '../pages/test/Test';

import Layout from '../layout/Layout';
import VPC from '../pages/vpc/VPC';

import Compute from '../pages/compute/Compute';
import Subnet from '../pages/subnet/Subnet';
import { Box } from '@mui/material';
import RegionLoader from '../pages/loader/RegionLoader';
import VPCLoader from '../pages/loader/VPCLoader';




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
                        path: 'vpcs',
                        element: <VPC />
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