import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Function to get full image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return 'https://placehold.co/400x300?text=No+Image';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl}`;
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(product.image)}
        alt={product.name}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
        }}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          component={Link} 
          to={`/products/${product.id}`} 
          size="small" 
          color="primary"
          fullWidth
          variant="contained"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 