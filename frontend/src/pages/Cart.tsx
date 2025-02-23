import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Box,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import api from '../services/api';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total } = useSelector((state: RootState) => state.cart);
    const [shippingAddress, setShippingAddress] = useState('');

    const handleQuantityChange = (productId: number, change: number) => {
        const item = items.find(item => item.product.id === productId);
        if (item) {
            const newQuantity = Math.max(1, item.quantity + change);
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId: number) => {
        dispatch(removeFromCart(productId));
    };

    const handleCheckout = async () => {
        if (!shippingAddress) {
            alert('Please enter a shipping address');
            return;
        }

        try {
            const orderData = {
                shipping_address: shippingAddress,
                items: items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                }))
            };

            await api.post('/api/orders/', orderData);
            dispatch(clearCart());
            navigate('/orders');
        } catch (error: any) {
            console.error('Failed to place order:', error.response?.data || error);
            alert(error.response?.data?.error || 'Failed to place order. Please try again.');
        }
    };

    if (items.length === 0) {
        return (
            <Container>
                <Typography variant="h5" sx={{ my: 4 }}>
                    Your cart is empty
                </Typography>
                <Button variant="contained" onClick={() => navigate('/products')}>
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Shopping Cart
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.product.id}>
                                <TableCell>
                                    <Typography variant="subtitle1">
                                        {item.product.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    ${item.product.price}
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(item.product.id, -1)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography sx={{ mx: 2 }}>
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(item.product.id, 1)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveItem(item.product.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Total: ${total.toFixed(2)}
                </Typography>

                <TextField
                    fullWidth
                    label="Shipping Address"
                    multiline
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    sx={{ my: 2 }}
                />

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                >
                    Proceed to Checkout
                </Button>
            </Box>
        </Container>
    );
};

export default Cart; 