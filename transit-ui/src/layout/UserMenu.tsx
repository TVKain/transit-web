import { useState } from "react";

import { IconButton, Menu, MenuItem } from "@mui/material";

import { AccountCircle, Logout } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";

export default function UserMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const auth = useAuth()
    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <AccountCircle fontSize="large" color="primary" />
            </IconButton>
            <Menu

                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => {
                    handleClose()
                    auth.logout()
                }}>
                    <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
            </Menu>
        </div >
    );
}