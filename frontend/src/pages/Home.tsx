import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
} from '@mui/material';
import api from '../services/api';
import { Product } from '../types';

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/api/products/');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
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

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to STEM Kit Store
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Discover our collection of STEM learning kits with interactive labs
                </Typography>
            </Box>

            <Grid container spacing={4} component="div">
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} component="div">
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image || '/placeholder.png'}
                                alt={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {product.name}
                                </Typography>
                                <Typography>
                                    {product.description.length > 100
                                        ? `${product.description.substring(0, 100)}...`
                                        : product.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    ${product.price}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/products/${product.id}`}
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home; 