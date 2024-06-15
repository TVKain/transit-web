import { ThemeProvider } from '@emotion/react';

import { CssBaseline } from '@mui/material';
import theme from './theme/theme';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { CookiesProvider } from 'react-cookie';

import routes from './routes/routes';


import { store } from "./redux/store.js";
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from 'react-query';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { DialogProvider } from './context/DialogContext.js';

const router = createBrowserRouter(routes);

const queryClient = new QueryClient()

function App() {
    return (
        <DialogProvider>
            <QueryClientProvider client={queryClient} >
                <Provider store={store}>
                    <CookiesProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <RouterProvider router={router} />
                            <ToastContainer hideProgressBar={true} position='bottom-left' autoClose={4000} />
                        </ThemeProvider>
                    </CookiesProvider>
                </Provider>
            </QueryClientProvider>
        </DialogProvider>
    );
}

export default App;