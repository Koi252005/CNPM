import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Products = () => {
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
                console.error('Error fetching products:', error);
                setError('Failed to load products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Our Products
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Products; 