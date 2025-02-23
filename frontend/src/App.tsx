import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Navbar from './components/Navbar';

// Components
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderManagement from './pages/OrderManagement';
import Reports from './pages/Reports';
import LabSupport from './pages/LabSupport';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Support from './pages/Support';

type PrivateRouteProps = {
    children: React.ReactNode;
    roles?: string[];
};

function PrivateRoute({ children, roles }: PrivateRouteProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && roles.length > 0 && user) {
        const hasRequiredRole = roles.includes(user.role);
        if (!hasRequiredRole) {
            return <Navigate to="/" />;
        }
    }

    return <>{children}</>;
}

function App() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    const routes = (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route 
                path="/orders" 
                element={
                    <PrivateRoute>
                        <Orders />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/order-management" 
                element={
                    <PrivateRoute roles={['admin', 'staff']}>
                        <OrderManagement />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/reports" 
                element={
                    <PrivateRoute roles={['admin', 'manager']}>
                        <Reports />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/lab-support" 
                element={
                    <PrivateRoute>
                        <LabSupport />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/support" 
                element={
                    <PrivateRoute>
                        <Support />
                    </PrivateRoute>
                } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<PrivateRoute roles={['admin', 'manager']}><Admin /></PrivateRoute>} />
        </Routes>
    );

    return (
        <Router>
            <Navbar />
            <Layout>{routes}</Layout>
        </Router>
    );
}

export default App;