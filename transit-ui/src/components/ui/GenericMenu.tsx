import React, { useState, ReactElement } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MenuItemProps {
    label: string;
    icon?: ReactElement; // Icon element to be displayed to the left of the label
    onClick: () => void;
    color?: string;
}

interface GenericMenuProps {
    triggerElement?: ReactElement;
    menuItems: MenuItemProps[];
    menuWidth?: number;
}

const GenericMenu: React.FC<GenericMenuProps> = ({ triggerElement, menuItems, menuWidth = 128 }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const defaultTrigger: ReactElement = (
        <IconButton>
            <MoreVertIcon />
        </IconButton>
    );

    const triggerWithProps: ReactElement = React.cloneElement(triggerElement || defaultTrigger, {
        onClick: handleClick,
        'aria-controls': 'generic-menu',
        'aria-haspopup': 'true'
    });

    return (
        <div>
            {triggerWithProps}
            <Menu
                id={`generic-menu-${Math.random().toString(36).substring(7)}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: menuWidth
                        }
                    }
                }}

            >
                {menuItems.map((item, index) => (
                    <MenuItem disableRipple color={item.color || 'inherit'} key={index} onClick={() => { handleClose(); item.onClick(); }}>
                        {item.icon &&
                            <ListItemIcon
                                sx={{ color: item.color }}>
                                {item.icon}
                            </ListItemIcon>}
                        <ListItemText
                            sx={{
                                color: item.color
                            }}
                            primary={item.label}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default GenericMenu