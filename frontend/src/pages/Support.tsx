import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Chip,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { RootState } from '../store';
import { SupportTicket, Lab } from '../types';
import api from '../services/api';

function Support() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        lab_id: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketsResponse, labsResponse] = await Promise.all([
                    api.get('/api/support/'),
                    api.get('/api/labs/'),
                ]);
                setTickets(ticketsResponse.data);
                setLabs(labsResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateTicket = async () => {
        try {
            const response = await api.post('/api/support/', newTicket);
            setTickets([...tickets, response.data]);
            setOpenDialog(false);
            setNewTicket({ title: '', description: '', lab_id: '' });
        } catch (error) {
            alert('Failed to create ticket');
        }
    };

    const handleSendMessage = async (ticketId: number) => {
        if (!newMessage.trim()) return;

        try {
            await api.post(`/api/support/${ticketId}/add_message/`, {
                message: newMessage,
            });
            
            // Refresh ticket data
            const response = await api.get('/api/support/');
            setTickets(response.data);
            setNewMessage('');
        } catch (error) {
            alert('Failed to send message');
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ my: 4 }}>
                    Support Tickets
                </Typography>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>
                    Create New Ticket
                </Button>
            </Box>

            <Grid container spacing={3} component="div">
                {tickets.map((ticket) => (
                    <Grid item xs={12} key={ticket.id} component="div">
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">{ticket.title}</Typography>
                                    <Chip
                                        label={ticket.status}
                                        color={
                                            ticket.status === 'resolved'
                                                ? 'success'
                                                : ticket.status === 'closed'
                                                ? 'error'
                                                : 'default'
                                        }
                                    />
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Lab: {ticket.lab.title}
                                </Typography>
                                <Typography paragraph>{ticket.description}</Typography>

                                <List>
                                    {ticket.messages.map((message) => (
                                        <ListItem key={message.id}>
                                            <ListItemText
                                                primary={message.message}
                                                secondary={`${message.sender.username} - ${new Date(
                                                    message.created_at
                                                ).toLocaleString()}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                {ticket.status !== 'closed' && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleSendMessage(ticket.id)}
                                        >
                                            Send
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Support Ticket</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newTicket.description}
                        onChange={(e) =>
                            setNewTicket({ ...newTicket, description: e.target.value })
                        }
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Lab</InputLabel>
                        <Select
                            value={newTicket.lab_id}
                            onChange={(e) =>
                                setNewTicket({ ...newTicket, lab_id: e.target.value })
                            }
                        >
                            {labs.map((lab) => (
                                <MenuItem key={lab.id} value={lab.id}>
                                    {lab.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateTicket}
                        disabled={!newTicket.title || !newTicket.description || !newTicket.lab_id}
                    >
                        Create Ticket
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Support; 