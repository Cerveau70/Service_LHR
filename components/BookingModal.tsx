import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Property } from '../types';

interface BookingModalProps {
    property: Property;
    onClose: () => void;
    onSuccess: (data: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        email: '',
        contact: '',
        address: '',
        visitDate: '',
    });

    const isHousing = property.serviceType === 'Logement';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would integrate with a payment gateway (Wave, Visa)
        // For now, we simulate success
        console.log("Booking data:", { propertyId: property.id, ...formData });
        onSuccess({ propertyId: property.id, ...formData });
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h3" color="primary">
                        Réservation pour : {property.name}
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ py: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Nom"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="firstname"
                                label="Prénom(s)"
                                required
                                value={formData.firstname}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="contact"
                                label="Contact"
                                type="tel"
                                required
                                value={formData.contact}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="address"
                                label="Adresse"
                                required
                                value={formData.address}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </Grid>

                        {isHousing && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="visitDate"
                                    label="Date de visite"
                                    type="date"
                                    required
                                    value={formData.visitDate}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={onClose} variant="outlined">
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Payer les frais {isHousing ? `(${property.visitFee?.toLocaleString('fr-FR')} FCFA)` : ''}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BookingModal;
