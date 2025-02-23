import React from 'react';
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
    IconButton,
    Collapse,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Order, OrderItem } from '../types';
import api from '../services/api';
import OrderStatus from '../components/OrderStatus';

interface RowProps {
    order: Order;
}

const OrderRow = ({ order }: RowProps) => {
    const [open, setOpen] = React.useState(false);

    const getStatusColor = (status: Order['status']): 'success' | 'error' | 'info' | 'default' => {
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

    const getEstimatedDelivery = (status: Order['status'], createdAt: string) => {
        const orderDate = new Date(createdAt);
        let deliveryDate = new Date(orderDate);
        
        switch (status) {
            case 'pending':
                deliveryDate.setDate(orderDate.getDate() + 7);
                return `Estimated delivery by ${deliveryDate.toLocaleDateString()}`;
            case 'processing':
                deliveryDate.setDate(orderDate.getDate() + 5);
                return `Estimated delivery by ${deliveryDate.toLocaleDateString()}`;
            case 'shipped':
                deliveryDate.setDate(orderDate.getDate() + 2);
                return `Estimated delivery by ${deliveryDate.toLocaleDateString()}`;
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Order cancelled';
            default:
                return '';
        }
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                    />
                </TableCell>
                <TableCell align="right">${order.total_amount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Details
                            </Typography>
                            
                            <OrderStatus status={order.status} />
                            
                            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>
                                {getEstimatedDelivery(order.status, order.created_at)}
                            </Typography>

                            <Divider sx={{ my: 2 }} />
                            
                            <List>
                                {order.items.map((item: OrderItem) => (
                                    <ListItem key={item.id}>
                                        <ListItemText
                                            primary={item.product.name}
                                            secondary={`Quantity: ${item.quantity} | Price: $${item.price}`}
                                        />
                                        <Chip
                                            label={item.labs_activated ? 'Labs Activated' : 'Labs Pending'}
                                            color={item.labs_activated ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Shipping Address: {order.shipping_address}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const Orders = () => {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/orders/');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container>
                <Typography variant="h5" sx={{ my: 4 }}>
                    No orders found
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Order History
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <OrderRow key={order.id} order={order} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Orders;