import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
    Card,
    CardContent,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface LabSupport {
    id: number;
    lab: {
        id: number;
        title: string;
    };
    customer: {
        id: number;
        username: string;
    };
    staff: {
        id: number;
        username: string;
    };
    support_type: string;
    description: string;
    solution: string;
    created_at: string;
    resolved_at: string | null;
    duration_minutes: number;
    is_resolved: boolean;
    remaining_support_count: number;
}

interface Statistics {
    total_supports: number;
    resolved_supports: number;
    support_by_type: Array<{
        support_type: string;
        count: number;
    }>;
    support_by_lab: Array<{
        lab__title: string;
        count: number;
    }>;
    staff_performance: Array<{
        staff__username: string;
        total_supports: number;
        resolved_supports: number;
    }>;
}

const LabSupport = () => {
    const [supports, setSupports] = useState<LabSupport[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSupport, setSelectedSupport] = useState<LabSupport | null>(null);
    const [newSupport, setNewSupport] = useState({
        lab_id: '',
        support_type: '',
        description: '',
        solution: '',
        duration_minutes: 0,
    });
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        fetchSupports();
        if (user?.role && ['admin', 'staff', 'manager'].includes(user.role)) {
            fetchStatistics();
        }
    }, [user]);

    const fetchSupports = async () => {
        try {
            const response = await api.get('/api/support/lab-support/');
            setSupports(response.data);
        } catch (error) {
            console.error('Error fetching lab supports:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/api/support/lab-support/statistics/');
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleCreateSupport = async () => {
        try {
            await api.post('/api/support/lab-support/', newSupport);
            setOpenDialog(false);
            fetchSupports();
            if (user?.role && ['admin', 'staff', 'manager'].includes(user.role)) {
                fetchStatistics();
            }
        } catch (error) {
            console.error('Error creating support:', error);
        }
    };

    const handleResolveSupport = async (supportId: number) => {
        try {
            await api.post(`/api/support/lab-support/${supportId}/resolve/`);
            fetchSupports();
            if (user?.role && ['admin', 'staff', 'manager'].includes(user.role)) {
                fetchStatistics();
            }
        } catch (error) {
            console.error('Error resolving support:', error);
        }
    };

    const renderStatistics = () => {
        if (!statistics) return null;

        return (
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Overall Statistics
                            </Typography>
                            <Typography>
                                Total Supports: {statistics.total_supports}
                            </Typography>
                            <Typography>
                                Resolved Supports: {statistics.resolved_supports}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Support by Type
                            </Typography>
                            {statistics.support_by_type.map((item) => (
                                <Chip
                                    key={item.support_type}
                                    label={`${item.support_type}: ${item.count}`}
                                    sx={{ m: 0.5 }}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Staff Performance
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Staff Member</TableCell>
                                            <TableCell align="right">Total Supports</TableCell>
                                            <TableCell align="right">Resolved Supports</TableCell>
                                            <TableCell align="right">Resolution Rate</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statistics.staff_performance.map((staff) => (
                                            <TableRow key={staff.staff__username}>
                                                <TableCell>{staff.staff__username}</TableCell>
                                                <TableCell align="right">{staff.total_supports}</TableCell>
                                                <TableCell align="right">{staff.resolved_supports}</TableCell>
                                                <TableCell align="right">
                                                    {((staff.resolved_supports / staff.total_supports) * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ my: 4 }}>
                    Lab Support Management
                </Typography>

                {user?.role && ['admin', 'staff', 'manager'].includes(user.role) && renderStatistics()}

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDialog(true)}
                    >
                        Request Support
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Lab</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supports.map((support) => (
                                <TableRow key={support.id}>
                                    <TableCell>{support.lab.title}</TableCell>
                                    <TableCell>{support.support_type}</TableCell>
                                    <TableCell>{support.description}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={support.is_resolved ? 'Resolved' : 'Pending'}
                                            color={support.is_resolved ? 'success' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(support.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {!support.is_resolved && ((user?.role && ['admin', 'staff'].includes(user.role)) || user?.id === support.customer.id) && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleResolveSupport(support.id)}
                                            >
                                                Mark as Resolved
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request Lab Support</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Support Type</InputLabel>
                        <Select
                            value={newSupport.support_type}
                            onChange={(e) => setNewSupport({
                                ...newSupport,
                                support_type: e.target.value
                            })}
                        >
                            <MenuItem value="technical">Technical Support</MenuItem>
                            <MenuItem value="guidance">Lab Guidance</MenuItem>
                            <MenuItem value="troubleshooting">Troubleshooting</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newSupport.description}
                        onChange={(e) => setNewSupport({
                            ...newSupport,
                            description: e.target.value
                        })}
                        sx={{ mt: 2 }}
                    />

                    {user?.role && ['admin', 'staff'].includes(user.role) && (
                        <TextField
                            fullWidth
                            label="Solution"
                            multiline
                            rows={4}
                            value={newSupport.solution}
                            onChange={(e) => setNewSupport({
                                ...newSupport,
                                solution: e.target.value
                            })}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateSupport}
                        disabled={!newSupport.support_type || !newSupport.description}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LabSupport; 