import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/login');
    };

    // Get first letter of name for avatar
    const getAvatarLetter = () => {
        if (!user) return 'U';
        
        try {
            // Ensure we're working with strings
            const username = typeof user.username === 'string' ? user.username : String(user.username || '');
            const firstName = typeof user.first_name === 'string' ? user.first_name : String(user.first_name || '');
            
            if (username && username.length > 0) {
                return username[0].toUpperCase();
            }
            
            if (firstName && firstName.length > 0) {
                return firstName[0].toUpperCase();
            }
        } catch (error) {
            console.error('Error getting avatar letter:', error);
        }
        
        return 'U';
    };

    // Get display name
    const getDisplayName = () => {
        if (!user) return 'User';
        
        try {
            // Ensure we're working with strings
            const username = typeof user.username === 'string' ? user.username : String(user.username || '');
            const firstName = typeof user.first_name === 'string' ? user.first_name : String(user.first_name || '');
            const lastName = typeof user.last_name === 'string' ? user.last_name : String(user.last_name || '');
            
            if (username && username.length > 0) {
                return username;
            }
            
            if ((firstName && firstName.length > 0) || (lastName && lastName.length > 0)) {
                return `${firstName} ${lastName}`.trim();
            }
        } catch (error) {
            console.error('Error getting display name:', error);
        }
        
        return 'User';
    };

    // Check if user has admin role
    const isAdmin = React.useMemo(() => {
        if (!user || !user.role) return false;
        return String(user.role).toLowerCase() !== 'customer';
    }, [user]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                        STEM Kit Store
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" component={Link} to="/products">
                            Products
                        </Button>
                        {user ? (
                            <>
                                <Button color="inherit" component={Link} to="/cart">
                                    Cart
                                </Button>
                                <Button color="inherit" component={Link} to="/orders">
                                    Orders
                                </Button>
                                {isAdmin && (
                                    <Button color="inherit" component={Link} to="/admin">
                                        Admin
                                    </Button>
                                )}
                                <Button color="inherit" component={Link} to="/support">
                                    Support
                                </Button>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                            {getAvatarLetter()}
                                        </Avatar>
                                    </IconButton>
                                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                        {getDisplayName()}
                                    </Typography>
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
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flex: 1, py: 4 }}>
                {children}
            </Container>
            <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} STEM Kit Store. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

export default Layout; 