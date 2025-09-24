
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Box,
    IconButton
} from '@mui/material';
import {
    LocationOn,
    Close,
    Euro
} from '@mui/icons-material';
import { Property } from '../types';

interface PropertyCardProps {
    property: Property;
    onBook: (property: Property) => void;
}


const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={property.images[0]}
                        alt={property.name}
                        sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                        label={property.available ? 'Disponible' : 'Indisponible'}
                        color={property.available ? 'success' : 'error'}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 'bold'
                        }}
                    />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                        {property.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {property.commune}, {property.city}
                        </Typography>
                    </Box>

                    {/* Service Type Badge */}
                    <Chip
                        label={property.serviceType}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />

                    <Typography variant="h5" component="p" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {property.price.toLocaleString('fr-FR')} FCFA
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            / {property.serviceType === 'Logement' ? 'mois' : 'nuit'}
                        </Typography>
                    </Typography>

                    {/* Advanced Details Preview */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <Typography component="span" sx={{ fontWeight: 'bold' }}>Superficie:</Typography> {property.characteristics.surface || 'N/A'} m²
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <Typography component="span" sx={{ fontWeight: 'bold' }}>Chambres:</Typography> {property.characteristics.chambres || 'N/A'}
                        </Typography>
                        {property.visitFee && (
                            <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                                💰 Frais de visite: {property.visitFee.toLocaleString('fr-FR')} FCFA
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowDetails(true)}
                            sx={{ flex: 1 }}
                            startIcon={<Euro fontSize="small" />}
                        >
                            Détails
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onBook(property)}
                            disabled={!property.available}
                            sx={{ flex: 1 }}
                        >
                            {property.available ? 'Réserver' : 'Indisponible'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {showDetails && (
                <PropertyDetailsModal
                    property={property}
                    onClose={() => setShowDetails(false)}
                    onBook={onBook}
                />
            )}
        </>
    );
};


const PropertyDetailsModal: React.FC<{ property: Property, onClose: () => void, onBook: (property: Property) => void }> = ({ property, onClose, onBook }) => {
    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h2" color="primary">
                        {property.name}
                    </Typography>
                    <IconButton onClick={onClose} size="large">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ py: 2 }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {property.images.map((img, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Box
                                component="img"
                                src={img}
                                alt={`${property.name} ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 1
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" gutterBottom>
                        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            📍 Adresse :
                        </Typography> {property.address}, {property.commune}, {property.city}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <Typography component="span" variant="subtitle2" color="text.primary">
                            🗺️ Localisation :
                        </Typography> [Visible après réservation]
                    </Typography>

                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        💰 {property.price.toLocaleString('fr-FR')} FCFA
                        <Typography component="span" variant="body1" color="text.secondary">
                            {' '}/ {property.serviceType === 'Logement' ? 'mois' : 'nuit'}
                        </Typography>
                    </Typography>

                    {property.visitFee && (
                        <Typography variant="body1" color="error" sx={{ mb: 2, fontWeight: 'bold' }}>
                            <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                🔑 Frais de visite :
                            </Typography> {property.visitFee.toLocaleString('fr-FR')} FCFA
                        </Typography>
                    )}

                    {property.bookingFee && (
                        <Typography variant="body1" color="warning.main" sx={{ mb: 2, fontWeight: 'bold' }}>
                            <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                💳 Frais de réservation :
                            </Typography> {property.bookingFee.toLocaleString('fr-FR')} FCFA
                        </Typography>
                    )}
                </Box>

                <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, pb: 1 }}>
                    ✨ Caractéristiques Détaillées
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {Object.entries(property.characteristics).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Additional Service-Specific Information */}
                {property.serviceType === 'Hôtel' && property.characteristics.capacite && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'info.contrastText' }}>
                            🏨 Informations Hôtel
                        </Typography>
                        <Typography variant="body2" color="info.contrastText">
                            Capacité: {property.characteristics.capacite} personnes
                        </Typography>
                    </Box>
                )}

                {property.serviceType === 'Résidence' && property.characteristics.equipements && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'success.contrastText' }}>
                            🏢 Équipements de la Résidence
                        </Typography>
                        <Typography variant="body2" color="success.contrastText">
                            {Array.isArray(property.characteristics.equipements)
                                ? property.characteristics.equipements.join(', ')
                                : property.characteristics.equipements
                            }
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={onClose} variant="outlined">
                    Fermer
                </Button>
                <Button
                    onClick={() => { onBook(property); onClose(); }}
                    disabled={!property.available}
                    variant="contained"
                    size="large"
                >
                    Procéder à la réservation
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default PropertyCard;
