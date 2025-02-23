import React, { useEffect, useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { RootState } from '../store';
import { Product, User, Order } from '../types';
import api from '../services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

interface NewProduct {
    name: string;
    description: string;
    price: string;
    stock: string;
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [tabValue, setTabValue] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        description: '',
        price: '',
        stock: '',
    });

    useEffect(() => {
        if (!user || !user.is_staff) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [productsRes, usersRes, ordersRes] = await Promise.all([
                    api.get('/api/products/'),
                    api.get('/api/users/'),
                    api.get('/api/orders/'),
                ]);
                setProducts(productsRes.data);
                setUsers(usersRes.data);
                setOrders(ordersRes.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleCreateProduct = async () => {
        try {
            const response = await api.post('/api/products/', {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
            });
            setProducts([...products, response.data]);
            setOpenProductDialog(false);
            setNewProduct({ name: '', description: '', price: '', stock: '' });
        } catch (error) {
            alert('Failed to create product');
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Admin Dashboard
            </Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Products" />
                    <Tab label="Users" />
                    <Tab label="Orders" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => setOpenProductDialog(true)}
                        >
                            Add New Product
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product: Product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    navigate(`/products/${product.id}`)
                                                }
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user: User) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.is_staff ? 'Admin' : 'Customer'}</TableCell>
                                        <TableCell>
                                            <Button size="small">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order: Order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>
                                            {order.customer.username}
                                        </TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>
                                            ${order.total_amount}
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small">Update Status</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </Paper>

            <Dialog
                open={openProductDialog}
                onClose={() => setOpenProductDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={newProduct.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewProduct({ ...newProduct, name: e.target.value })
                            }
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={newProduct.description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewProduct({
                                    ...newProduct,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            value={newProduct.price}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewProduct({ ...newProduct, price: e.target.value })
                            }
                            type="number"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Stock"
                            value={newProduct.stock}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewProduct({ ...newProduct, stock: e.target.value })
                            }
                            type="number"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateProduct} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Admin; 