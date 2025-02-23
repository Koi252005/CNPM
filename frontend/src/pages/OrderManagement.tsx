import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Order } from '../types';
import api from '../services/api';

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const getStatusColor = (status: string): 'success' | 'error' | 'info' | 'default' => {
        switch (status) {
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'processing':
            case 'shipped':
                return 'info';
            default:
                return 'default';
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders/');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            await api.post(`/api/orders/${selectedOrder.id}/update_status/`, {
                status: newStatus,
                note: note
            });
            
            // Refresh orders list
            fetchOrders();
            setOpenDialog(false);
            setNewStatus('');
            setNote('');
            setSelectedOrder(null);
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status');
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Order Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.customer.username}</TableCell>
                                <TableCell>
                                    {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                    />
                                </TableCell>
                                <TableCell>${order.total_amount}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setNewStatus(order.status);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Update Status
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                label="Status"
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Note"
                            multiline
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a note about this status update"
                        />

                        {selectedOrder && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">
                                    Order Details:
                                </Typography>
                                <Typography variant="body2">
                                    Shipping Address: {selectedOrder.shipping_address}
                                </Typography>
                                <Typography variant="body2">
                                    Items:
                                </Typography>
                                {selectedOrder.items.map((item) => (
                                    <Typography key={item.id} variant="body2">
                                        - {item.product.name} x {item.quantity}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateStatus}>
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrderManagement; 