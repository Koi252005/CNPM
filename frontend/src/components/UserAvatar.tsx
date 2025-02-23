import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import { logout } from '../store/slices/authSlice';

interface UserAvatarProps {
    user: {
        username: string;
        first_name?: string;
        last_name?: string;
        email?: string;
    };
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const displayName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}`
        : user.username;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
                {displayName}
            </Typography>
            <IconButton
                onClick={handleMenu}
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
            >
                <Avatar
                    sx={{ bgcolor: 'primary.main' }}
                >
                    {displayName.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default UserAvatar; 