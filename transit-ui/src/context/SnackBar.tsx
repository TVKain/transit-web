import { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'info' | 'success' | 'warning' | 'error'
}

const SnackbarContext = createContext(
    {
        // @ts-ignore
        showSnackbar: (message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => { },
        hideSnackbar: () => { }
    }
);

export const SnackbarProvider = ({ children }: { children: any }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info' // info, success, warning, error
    });

    const showSnackbar = useCallback((message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar((prev) => ({
            ...prev,
            open: false
        }));
    }, []);

    return (
        <>
            {/* @ts-ignore */}
            <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
                {children}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={hideSnackbar}
                >
                    <Alert
                        onClose={hideSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: 256 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </SnackbarContext.Provider>
        </>

    );
};

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};
