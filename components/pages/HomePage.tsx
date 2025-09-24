import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Paper,
    IconButton,
    useTheme
} from '@mui/material';
import {
    Search,
    LocationOn,
    Euro,
    Home,
    Hotel,
    Apartment,
    Star,
    Wifi,
    LocalParking,
    FitnessCenter
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Property, ServiceType } from '../../types';

interface HomePageProps {
    onBook?: (property: Property) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onBook }) => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProperties = async () => {
            try {
                // Import services dynamically
                const { default: housingService } = await import('../../services/housingService');
                const { default: hotelService } = await import('../../services/hotelService');
                const { default: residenceService } = await import('../../services/residenceService');

                const [housingData, hotelData, residenceData] = await Promise.all([
                    housingService.getAllProperties(),
                    hotelService.getAllRooms(),
                    residenceService.getAllResidences()
                ]);

                const combined = [...housingData, ...hotelData, ...residenceData];
                setAllProperties(combined);
                setFilteredProperties(combined);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProperties();
    }, []);

    useEffect(() => {
        const filtered = allProperties.filter(property => {
            const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                property.commune.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = !locationFilter || property.city.toLowerCase().includes(locationFilter.toLowerCase());

            return matchesSearch && matchesLocation;
        });
        setFilteredProperties(filtered);
    }, [searchTerm, locationFilter, allProperties]);

    const getServiceIcon = (serviceType: ServiceType) => {
        switch (serviceType) {
            case ServiceType.HOUSING:
                return <Home color="primary" />;
            case ServiceType.HOTEL:
                return <Hotel color="primary" />;
            case ServiceType.RESIDENCE:
                return <Apartment color="primary" />;
            default:
                return <Home color="primary" />;
        }
    };

    const getServiceColor = (serviceType: ServiceType) => {
        switch (serviceType) {
            case ServiceType.HOUSING:
                return 'primary';
            case ServiceType.HOTEL:
                return 'secondary';
            case ServiceType.RESIDENCE:
                return 'success';
            default:
                return 'primary';
        }
    };

    const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={property.images[0] || '/placeholder-property.jpg'}
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
                <Chip
                    icon={getServiceIcon(property.serviceType)}
                    label={property.serviceType}
                    color={getServiceColor(property.serviceType) as any}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
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

                <Typography variant="h5" component="p" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {property.price.toLocaleString('fr-FR')} FCFA
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        / {property.serviceType === 'Logement' ? 'mois' : 'nuit'}
                    </Typography>
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        component={Link}
                        to={`/${property.serviceType.toLowerCase()}`}
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1 }}
                    >
                        Voir tout
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        disabled={!property.available}
                        sx={{ flex: 1 }}
                    >
                        {property.available ? 'Réserver' : 'Indisponible'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                sx={{
                    position: 'relative',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    py: 12,
                    mb: 6
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Bienvenue sur Service LHR
                        </Typography>
                        <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
                            Votre plateforme de réservation immobilière en Côte d'Ivoire
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 6, maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
                            Découvrez nos meilleures offres de logements, hôtels et résidences avec des services de qualité et des prix compétitifs
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                                <TextField
                                    fullWidth
                                    placeholder="Rechercher par nom, ville..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                                <TextField
                                    fullWidth
                                    placeholder="Localisation"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 17%' } }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ height: '100%', borderRadius: 2 }}
                                >
                                    Rechercher
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg" sx={{ mb: 6 }}>
                {/* Services Overview */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom color="primary" sx={{ textAlign: 'center', mb: 4 }}>
                        Nos Services
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                            <Card sx={{ textAlign: 'center', p: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <Home sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h5" component="h3" gutterBottom color="primary">
                                    Logements
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Trouvez le logement idéal pour votre famille avec nos propriétés sélectionnées
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/logement"
                                    variant="contained"
                                    fullWidth
                                >
                                    Voir les Logements
                                </Button>
                            </Card>
                        </Box>

                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                            <Card sx={{ textAlign: 'center', p: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <Hotel sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                                <Typography variant="h5" component="h3" gutterBottom color="secondary">
                                    Hôtels
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Réservez votre séjour dans nos hôtels partenaires avec des services de qualité
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/hotel"
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                >
                                    Voir les Hôtels
                                </Button>
                            </Card>
                        </Box>

                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                            <Card sx={{ textAlign: 'center', p: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                                <Apartment sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                                <Typography variant="h5" component="h3" gutterBottom color="success">
                                    Résidences
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Découvrez nos résidences modernes avec tous les équipements nécessaires
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/residence"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                >
                                    Voir les Résidences
                                </Button>
                            </Card>
                        </Box>
                    </Box>
                </Box>

                {/* Featured Properties */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" component="h2" gutterBottom color="primary" sx={{ textAlign: 'center', mb: 4 }}>
                        Propriétés Disponibles ({filteredProperties.length})
                    </Typography>

                    {!loading && filteredProperties.length > 0 && (
                        <Box sx={{ mb: 3, p: 3, bgcolor: 'success.light', borderRadius: 2, color: 'white', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                ✨ {filteredProperties.filter(p => p.available).length} propriétés disponibles pour réservation immédiate
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {loading ? (
                            <Box sx={{ flex: '1 1 100%' }}>
                                <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                                    Chargement des propriétés...
                                </Typography>
                            </Box>
                        ) : filteredProperties.length > 0 ? (
                            <>
                                {filteredProperties.slice(0, 6).map((property) => (
                                    <Box key={property.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 33%' } }}>
                                        <PropertyCard property={property} />
                                    </Box>
                                ))}
                            </>
                        ) : (
                            <Box sx={{ flex: '1 1 100%' }}>
                                <Typography variant="h6" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    Aucune propriété trouvée. Essayez de modifier vos critères de recherche.
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {filteredProperties.length > 6 && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                component={Link}
                                to="/logement"
                                variant="outlined"
                                size="large"
                            >
                                Voir toutes les propriétés
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Features Section */}
                <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper' }}>
                    <Typography variant="h3" component="h2" gutterBottom color="primary">
                        Pourquoi choisir LogFront ?
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                        Nous vous offrons une expérience unique avec des services de qualité et un accompagnement personnalisé
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mt: 4 }}>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
                            <Box sx={{ p: 2 }}>
                                <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Qualité Garantie
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Toutes nos propriétés sont vérifiées et sélectionnées avec soin
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
                            <Box sx={{ p: 2 }}>
                                <Euro sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Meilleurs Prix
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Des tarifs compétitifs et transparents sans frais cachés
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
                            <Box sx={{ p: 2 }}>
                                <Wifi sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Services Complets
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Réservation en ligne, support 24/7 et accompagnement personnalisé
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
                            <Box sx={{ p: 2 }}>
                                <LocalParking sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Sécurité
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Paiements sécurisés et protection de vos données personnelles
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
