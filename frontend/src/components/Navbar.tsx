import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Badge,
} from '@mui/material';
import { RootState } from '../store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UserAvatar from './UserAvatar';

const Navbar = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state: RootState) => state.cart);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const isAdminOrStaff = user?.role && ['admin', 'staff'].includes(user.role);
    const isAdminOrManager = user?.role && ['admin', 'manager'].includes(user.role);

    return (
        <AppBar position="sticky">
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        STEM Kit Store
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/products"
                        >
                            Products
                        </Button>

                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/cart"
                            startIcon={
                                <Badge badgeContent={totalItems} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            }
                        >
                            Cart
                        </Button>

                        {isAuthenticated && (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/orders"
                                >
                                    Orders
                                </Button>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/support"
                                >
                                    Support
                                </Button>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/lab-support"
                                >
                                    Lab Support
                                </Button>
                            </>
                        )}

                        {isAdminOrStaff && (
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/order-management"
                            >
                                Manage Orders
                            </Button>
                        )}

                        {isAdminOrManager && (
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/reports"
                            >
                                Reports
                            </Button>
                        )}

                        {isAuthenticated && user ? (
                            <UserAvatar user={user} />
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 