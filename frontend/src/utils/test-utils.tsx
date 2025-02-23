import React from 'react';
import { render } from '@testing-library/react';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cartReducer from '../store/slices/cartSlice';

interface RootState {
    cart: ReturnType<typeof cartReducer>;
}

interface RenderOptions {
    preloadedState?: PreloadedState<RootState>;
    store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState,
        store = configureStore({
            reducer: {
                cart: cartReducer,
            },
            preloadedState: preloadedState || {},
        }),
        ...renderOptions
    }: RenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={store}>{children}</Provider>;
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
} 