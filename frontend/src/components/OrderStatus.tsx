import React from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Paper,
} from '@mui/material';

const steps = [
    { label: 'Pending', description: 'Order is being processed' },
    { label: 'Processing', description: 'Order is being prepared' },
    { label: 'Shipped', description: 'Order is on the way' },
    { label: 'Delivered', description: 'Order has been delivered' },
];

interface OrderStatusProps {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
    const getActiveStep = () => {
        switch (status) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'shipped':
                return 2;
            case 'delivered':
                return 3;
            case 'cancelled':
                return -1;
            default:
                return 0;
        }
    };

    if (status === 'cancelled') {
        return (
            <Paper sx={{ p: 2, bgcolor: '#fff3f3' }}>
                <Typography color="error" variant="h6">
                    Order Cancelled
                </Typography>
                <Typography color="textSecondary">
                    This order has been cancelled
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Stepper activeStep={getActiveStep()} alternativeLabel>
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel>
                            <Typography variant="body2">{step.label}</Typography>
                            <Typography variant="caption" color="textSecondary">
                                {step.description}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default OrderStatus; 