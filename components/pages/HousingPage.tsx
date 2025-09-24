import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Fab,
  Rating,
  Divider,
  Stack,
  Avatar,
  Badge
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  LocalParking as ParkingIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Restaurant as RestaurantIcon,
  RoomService as RoomServiceIcon,
  BusinessCenter as BusinessIcon,
  MeetingRoom as MeetingIcon,
  Spa as SpaIcon,
  ChildCare as ChildIcon,
  Pets as PetsIcon,
  SmokingRooms as SmokingIcon,
  Accessible as AccessibleIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  Kitchen as KitchenIcon,
  Balcony as BalconyIcon,
  Yard as YardIcon,
  Garage as GarageIcon
} from '@mui/icons-material';
import { ServiceType, Property } from '../../types/extended';
import { cities, communes, propertyTypes } from '../../constants';
import api from '../../services/api';
import PropertyCard from '../PropertyCard';
import BookingModal from '../BookingModal';

const HousingPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [minSurface, setMinSurface] = useState('');
  const [isBooking, setIsBooking] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const filters = {
        serviceType: ServiceType.HOUSING,
        city: selectedCity,
        commune: selectedCommune,
        propertyType: selectedPropertyType,
      };
      const data = await api.getProperties(filters);
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, [selectedCity, selectedCommune, selectedPropertyType]);

  const handleBookingSuccess = (data: any) => {
    const reservation = {
      ...data,
      propertyId: isBooking!.id,
      propertyName: isBooking!.name,
      bookingDate: new Date().toISOString(),
      visitFee: isBooking!.visitFee || 0,
      status: 'Validated',
      agentId: isBooking!.agentId,
      receiptNumber: `REC-${Date.now()}`,
      agentContact1: 'agent1@example.com',
      agentContact2: 'agent2@example.com',
    };
    console.log('Visit Reservation Created:', reservation);
    alert("Réservation simulée avec succès ! Un e-mail de confirmation a été envoyé.");
    setIsBooking(null);
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'wifi': <WifiIcon fontSize="small" />,
      'climatisation': <AcIcon fontSize="small" />,
      'parking': <ParkingIcon fontSize="small" />,
      'garage': <GarageIcon fontSize="small" />,
      'piscine': <PoolIcon fontSize="small" />,
      'jardin': <YardIcon fontSize="small" />,
      'balcon': <BalconyIcon fontSize="small" />,
      'cuisine': <KitchenIcon fontSize="small" />,
      'chambres': <BedIcon fontSize="small" />,
      'salles-de-bain': <BathIcon fontSize="small" />,
      'gym': <GymIcon fontSize="small" />,
      'restaurant': <RestaurantIcon fontSize="small" />,
      'enfants': <ChildIcon fontSize="small" />,
      'animaux': <PetsIcon fontSize="small" />,
      'fumeur': <SmokingIcon fontSize="small" />,
      'accessible': <AccessibleIcon fontSize="small" />,
    };
    return iconMap[amenity.toLowerCase()] || <StarIcon fontSize="small" />;
  };

  const filteredProperties = properties.filter(property => {
    const price = property.price;
    const characteristics = property.characteristics || {};

    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesBedrooms = !bedrooms || (Number(characteristics.bedrooms) >= parseInt(bedrooms));
    const matchesBathrooms = !bathrooms || (Number(characteristics.bathrooms) >= parseInt(bathrooms));
    const matchesSurface = !minSurface || (Number(characteristics.surface) >= parseInt(minSurface));

    return matchesPrice && matchesBedrooms && matchesBathrooms && matchesSurface;
  });

  const availableProperties = filteredProperties.filter(p => p.available);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{
        mb: 6,
        p: 6,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #4caf5020 0%, #4caf5005 100%)',
        border: '2px solid #4caf5030',
        textAlign: 'center'
      }}>
        <Box sx={{ fontSize: '5rem', mb: 3, color: '#4caf50' }}>
          <HomeIcon fontSize="inherit" />
        </Box>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
          🏠 Logements
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Trouvez le logement idéal pour votre famille avec nos propriétés sélectionnées
        </Typography>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
          <Chip
            icon={<HomeIcon />}
            label={`${filteredProperties.length} propriétés`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '1rem', py: 1 }}
          />
          <Chip
            icon={<SearchIcon />}
            label={`${availableProperties.length} disponibles`}
            color="success"
            variant="outlined"
            sx={{ fontSize: '1rem', py: 1 }}
          />
          <Chip
            icon={<LocationIcon />}
            label={`${new Set(filteredProperties.map(p => p.city)).size} villes`}
            color="info"
            variant="outlined"
            sx={{ fontSize: '1rem', py: 1 }}
          />
        </Box>
      </Box>

      {/* Filters Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            Filtres de recherche - Logements
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterIcon />}
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Ville</InputLabel>
              <Select
                value={selectedCity}
                label="Ville"
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedCommune('');
                }}
              >
                <MenuItem value="">
                  <em>Toutes les villes</em>
                </MenuItem>
                {cities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!selectedCity}>
              <InputLabel>Commune</InputLabel>
              <Select
                value={selectedCommune}
                label="Commune"
                onChange={(e) => setSelectedCommune(e.target.value)}
              >
                <MenuItem value="">
                  <em>Toutes les communes</em>
                </MenuItem>
                {selectedCity && communes[selectedCity as keyof typeof communes]?.map(commune => (
                  <MenuItem key={commune} value={commune}>{commune}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type de propriété</InputLabel>
              <Select
                value={selectedPropertyType}
                label="Type de propriété"
                onChange={(e) => setSelectedPropertyType(e.target.value)}
              >
                <MenuItem value="">
                  <em>Tous les types</em>
                </MenuItem>
                {propertyTypes[ServiceType.HOUSING]?.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Fourchette de prix (XOF)</InputLabel>
              <Select
                value={`${priceRange[0]}-${priceRange[1]}`}
                label="Fourchette de prix (XOF)"
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
              >
                <MenuItem value="0-100000">0 - 100,000 XOF</MenuItem>
                <MenuItem value="100000-300000">100,000 - 300,000 XOF</MenuItem>
                <MenuItem value="300000-500000">300,000 - 500,000 XOF</MenuItem>
                <MenuItem value="500000-1000000">500,000 - 1,000,000 XOF</MenuItem>
                <MenuItem value="1000000-10000000">1,000,000+ XOF</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Nombre minimum de chambres"
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              fullWidth
              label="Nombre minimum de salles de bain"
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <TextField
              fullWidth
              label="Surface minimum (m²)"
              type="number"
              value={minSurface}
              onChange={(e) => setMinSurface(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
        )}
      </Paper>

      {/* Properties Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon />
          Propriétés Logement ({filteredProperties.length})
        </Typography>

        {availableProperties.length > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              ✨ {availableProperties.length} propriétés disponibles pour réservation immédiate
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 3 }}>
            Chargement des logements...
          </Typography>
        </Box>
      )}

      {/* Properties Grid */}
      {!loading && filteredProperties.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {filteredProperties.map(property => (
            <Card key={property.id} sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.images[0] || 'https://via.placeholder.com/400x200?text=Pas+d\'image'}
                  alt={property.name}
                />
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <Chip
                    label={property.available ? 'Disponible' : 'Indisponible'}
                    color={property.available ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                  <Chip
                    label={property.serviceType}
                    color="primary"
                    size="small"
                    sx={{ backgroundColor: '#4caf50' }}
                  />
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  {property.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {property.city}, {property.commune}
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {property.price.toLocaleString()} XOF/nuit
                </Typography>

                {property.characteristics && Object.keys(property.characteristics).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Caractéristiques:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.entries(property.characteristics).slice(0, 6).map(([key, value]) => (
                        <Chip
                          key={key}
                          icon={getAmenityIcon(key) as React.ReactElement}
                          label={`${key}: ${String(value)}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {Object.keys(property.characteristics).length > 6 && (
                        <Chip
                          label={`+${Object.keys(property.characteristics).length - 6}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant={property.available ? 'contained' : 'outlined'}
                    color={property.available ? 'primary' : 'error'}
                    fullWidth
                    onClick={() => property.available && setIsBooking(property)}
                    disabled={!property.available}
                  >
                    {property.available ? 'Réserver maintenant' : 'Non disponible'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredProperties.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucun logement trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aucun logement ne correspond à vos critères de recherche.
            Essayez de modifier vos filtres.
          </Typography>
        </Paper>
      )}

      {/* Booking Modal */}
      {isBooking && (
        <BookingModal
          property={isBooking}
          onClose={() => setIsBooking(null)}
          onSuccess={(data) => handleBookingSuccess(data)}
        />
      )}

      {/* Floating Action Button for Filters */}
      <Fab
        color="primary"
        aria-label="filters"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FilterIcon />
      </Fab>
    </Container>
  );
};

export default HousingPage;
