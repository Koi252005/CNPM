import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Box,
    Tab,
    Tabs,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    BarChart,
    LineChart,
} from '@mui/x-charts';
import * as XLSX from 'xlsx';
import api from '../services/api';

interface SalesData {
    date: string;
    total: number;
    orders: number;
}

interface SupportData {
    date: string;
    tickets: number;
    resolved: number;
}

interface DeliveryData {
    status: string;
    count: number;
}

const Reports = () => {
    const [tabValue, setTabValue] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [supportData, setSupportData] = useState<SupportData[]>([]);
    const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);

    useEffect(() => {
        fetchReportData();
    }, [startDate, endDate]);

    const fetchReportData = async () => {
        if (!startDate || !endDate) return;

        try {
            const [salesResponse, supportResponse, deliveryResponse] = await Promise.all([
                api.get('/api/reports/sales/', {
                    params: {
                        start_date: startDate.toISOString().split('T')[0],
                        end_date: endDate.toISOString().split('T')[0],
                    },
                }),
                api.get('/api/reports/support/'),
                api.get('/api/reports/delivery/'),
            ]);

            setSalesData(salesResponse.data);
            setSupportData(supportResponse.data);
            setDeliveryData(deliveryResponse.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Sales worksheet
        const salesWS = XLSX.utils.json_to_sheet(salesData.map(item => ({
            Date: item.date,
            'Total Sales': item.total,
            'Number of Orders': item.orders,
        })));
        XLSX.utils.book_append_sheet(workbook, salesWS, 'Sales Report');

        // Support worksheet
        const supportWS = XLSX.utils.json_to_sheet(supportData.map(item => ({
            Date: item.date,
            'Total Tickets': item.tickets,
            'Resolved Tickets': item.resolved,
        })));
        XLSX.utils.book_append_sheet(workbook, supportWS, 'Support Report');

        // Delivery worksheet
        const deliveryWS = XLSX.utils.json_to_sheet(deliveryData.map(item => ({
            Status: item.status,
            Count: item.count,
        })));
        XLSX.utils.book_append_sheet(workbook, deliveryWS, 'Delivery Report');

        // Export the workbook
        XLSX.writeFile(workbook, 'stem_kit_store_report.xlsx');
    };

    const renderSalesReport = () => (
        <Grid container spacing={3} component="div">
            <Grid item xs={12} component="div">
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Sales Overview
                    </Typography>
                    <LineChart
                        xAxis={[{ data: salesData.map(d => new Date(d.date)) }]}
                        series={[
                            {
                                data: salesData.map(d => d.total),
                                label: 'Total Sales ($)',
                            },
                        ]}
                        height={300}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} component="div">
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Orders per Day
                    </Typography>
                    <BarChart
                        xAxis={[{ data: salesData.map(d => new Date(d.date)) }]}
                        series={[
                            {
                                data: salesData.map(d => d.orders),
                                label: 'Number of Orders',
                            },
                        ]}
                        height={300}
                    />
                </Paper>
            </Grid>
        </Grid>
    );

    const renderSupportReport = () => (
        <Grid container spacing={3} component="div">
            <Grid item xs={12} component="div">
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Support Tickets Overview
                    </Typography>
                    <LineChart
                        xAxis={[{ data: supportData.map(d => new Date(d.date)) }]}
                        series={[
                            {
                                data: supportData.map(d => d.tickets),
                                label: 'Total Tickets',
                            },
                            {
                                data: supportData.map(d => d.resolved),
                                label: 'Resolved Tickets',
                            },
                        ]}
                        height={300}
                    />
                </Paper>
            </Grid>
        </Grid>
    );

    const renderDeliveryReport = () => (
        <Grid container spacing={3} component="div">
            <Grid item xs={12} component="div">
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Delivery Status Distribution
                    </Typography>
                    <BarChart
                        xAxis={[{ data: deliveryData.map(d => d.status) }]}
                        series={[
                            {
                                data: deliveryData.map(d => d.count),
                                label: 'Number of Orders',
                            },
                        ]}
                        height={300}
                    />
                </Paper>
            </Grid>
        </Grid>
    );

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ my: 4 }}>
                    Reports & Analytics
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }} component="div">
                    <Grid item xs={12} md={4} component="div">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={4} component="div">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={4} component="div">
                        <Button
                            variant="contained"
                            onClick={exportToExcel}
                            sx={{ mt: 1 }}
                        >
                            Export to Excel
                        </Button>
                    </Grid>
                </Grid>

                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Sales Report" />
                    <Tab label="Support Report" />
                    <Tab label="Delivery Report" />
                </Tabs>
            </Box>

            {tabValue === 0 && renderSalesReport()}
            {tabValue === 1 && renderSupportReport()}
            {tabValue === 2 && renderDeliveryReport()}
        </Container>
    );
};

export default Reports; 