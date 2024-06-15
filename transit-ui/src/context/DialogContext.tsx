import { createContext, forwardRef, useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText, Fade } from '@mui/material';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

interface DialogContextType {
    openDialogId: string | null;
    openDialog: (dialogId: string) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType>({
    openDialogId: '',
    openDialog: (_: string) => { },
    closeDialog: () => { }
});

export const DialogProvider = ({ children }: { children: any }) => {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    const openDialog = (dialogId: string) => {
        setOpenDialogId(dialogId);
    };

    const closeDialog = () => {
        setOpenDialogId(null);
    };

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog, openDialogId }}>

            {children}
        </DialogContext.Provider>
    );
};


export const useDialog = () => {
    const { openDialog, closeDialog, openDialogId } = useContext(DialogContext);

    const DialogComponent = forwardRef(({
        dialogId,
        title,
        contextText,
        children,
        actions,
        dividers = false
    }: {
        dialogId: string,
        title: string,
        contextText?: string,
        dividers?: boolean,
        children: any,
        actions?: [any]
    }, ref: React.Ref<any>) => (
        <>

            <Dialog
                keepMounted
                fullWidth
                maxWidth="sm"
                open={openDialogId === dialogId}

                TransitionComponent={Fade}
                transitionDuration={{ enter: 500, exit: 500 }} // Adjust duration as needed
                ref={ref}
            >
                {title && <DialogTitle>{title}</DialogTitle>}
                <DialogContent dividers={dividers}>
                    {contextText && <DialogContentText>{contextText}</DialogContentText>}
                    {children}
                </DialogContent>
                {actions && <DialogActions>{actions}</DialogActions>}
            </Dialog >
        </>

    ));

    return { DialogComponent, openDialog, closeDialog };
};
