import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardMedia,
    Button,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import api from '../services/api';
import { Product } from '../types';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to get full image URL with validation
    const getImageUrl = (imageUrl: string | null): string => {
        if (!imageUrl?.trim()) return '/placeholder-product.jpg';
        try {
            const url = new URL(imageUrl);
            return url.toString();
        } catch {
            return imageUrl.startsWith('/') 
                ? `http://localhost:8000${imageUrl}`
                : `/placeholder-product.jpg`;
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Invalid product ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/api/products/${id}/`);
                
                if (!response.data) {
                    throw new Error('Product data is empty');
                }
                
                console.log('Product data from API:', response.data);
                
                // Validate and convert price
                const price = parseFloat(response.data.price);
                if (isNaN(price)) {
                    throw new Error('Invalid product price');
                }
                
                setProduct({
                    ...response.data,
                    price: price
                });
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(
                    error instanceof Error 
                        ? error.message 
                        : 'Failed to load product. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        
        try {
            dispatch(addToCart({ ...product, quantity: 1 }));
            setShowSuccess(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setError('Failed to add product to cart');
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Return to Home
                </Button>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Product not found
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Return to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4} component="div">
                <Grid item xs={12} md={6} component="div">
                    <Card>
                        <CardMedia
                            component="img"
                            height="300"
                            image={getImageUrl(product.image)}
                            alt={product.name}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = '/placeholder-product.jpg';
                                e.currentTarget.onerror = null; // Prevent infinite loop
                            }}
                            sx={{ 
                                objectFit: 'cover',
                                backgroundColor: '#f5f5f5'
                            }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} component="div">
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                        ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description || 'No description available'}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleAddToCart}
                            sx={{ mr: 2 }}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/cart')}
                        >
                            View Cart
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    Product added to cart successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductDetail; 