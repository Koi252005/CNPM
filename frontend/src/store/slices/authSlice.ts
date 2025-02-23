import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User } from '../../types';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    isLoading: false,
    error: null,
};

interface LoginCredentials {
    username: string;
    password: string;
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/token/', credentials);
            const { access, refresh } = response.data;
            
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            
            // Get user info after successful login
            const userResponse = await api.get('/api/users/me/');
            return { ...response.data, user: userResponse.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Login failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const response = await api.post('/api/token/refresh/', {
                refresh: state.auth.refreshToken,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/users/register/', userData);
            const { access, refresh } = response.data;
            
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            
            // Get user info after successful registration
            const userResponse = await api.get('/api/users/me/');
            return { tokens: { access, refresh }, user: userResponse.data };
        } catch (error: any) {
            // Handle different types of error responses
            if (error.response?.data) {
                // If error.response.data is an object with error messages
                if (typeof error.response.data === 'object') {
                    // Join all error messages into a single string
                    const errorMessages = Object.values(error.response.data)
                        .map(msg => Array.isArray(msg) ? msg.join('. ') : msg)
                        .join('. ');
                    return rejectWithValue(errorMessages);
                }
                // If error.response.data is a string
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Registration failed. Please try again.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
            localStorage.setItem('refreshToken', action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access;
                state.refreshToken = action.payload.refresh;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.access);
                localStorage.setItem('refreshToken', action.payload.refresh);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.access;
                localStorage.setItem('token', action.payload.access);
            })
            .addCase(refreshToken.rejected, (state) => {
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.tokens.access;
                state.refreshToken = action.payload.tokens.refresh;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, setToken, setRefreshToken, logout } = authSlice.actions;
export default authSlice.reducer; 