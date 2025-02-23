import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../../types';

interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(
                item => item.product.id === action.payload.id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    product: action.payload,
                    quantity: 1,
                });
            }

            state.total = calculateTotal(state.items);
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                item => item.product.id !== action.payload
            );
            state.total = calculateTotal(state.items);
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const item = state.items.find(
                item => item.product.id === action.payload.productId
            );
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
                state.total = calculateTotal(state.items);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 