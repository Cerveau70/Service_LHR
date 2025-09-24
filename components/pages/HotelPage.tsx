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
  TextField,
  Rating,
  Divider,
  Stack,
  Avatar,
  Badge
} from '@mui/material';
import {
  Hotel as HotelIcon,
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
  BreakfastDining as BreakfastIcon,
  LocalBar as BarIcon,
  Nightlife as NightlifeIcon,
  SportsBar as SportsIcon,
  Casino as CasinoIcon,
  BeachAccess as BeachIcon
} from '@mui/icons-material';
import { ServiceType, Property } from '../../types/extended';
import { cities, communes, propertyTypes } from '../../constants';
import api from '../../services/api';
import PropertyCard from '../PropertyCard';
import BookingModal from '../BookingModal';

const HotelPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [minStars, setMinStars] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const filters = {
        serviceType: ServiceType.HOTEL,
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
      'piscine': <PoolIcon fontSize="small" />,
      'gym': <GymIcon fontSize="small" />,
      'restaurant': <RestaurantIcon fontSize="small" />,
      'room-service': <RoomServiceIcon fontSize="small" />,
      'business-center': <BusinessIcon fontSize="small" />,
      'salle-reunion': <MeetingIcon fontSize="small" />,
      'spa': <SpaIcon fontSize="small" />,
      'enfants': <ChildIcon fontSize="small" />,
      'animaux': <PetsIcon fontSize="small" />,
      'fumeur': <SmokingIcon fontSize="small" />,
      'accessible': <AccessibleIcon fontSize="small" />,
      'petit-dejeuner': <BreakfastIcon fontSize="small" />,
      'bar': <BarIcon fontSize="small" />,
      'casino': <CasinoIcon fontSize="small" />,
      'plage': <BeachIcon fontSize="small" />,
      'sports': <SportsIcon fontSize="small" />,
    };
    return iconMap[amenity.toLowerCase()] || <StarIcon fontSize="small" />;
  };

  const filteredProperties = properties.filter(property => {
    const price = property.price;
    const characteristics = property.characteristics || {};

    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesStars = !minStars || (Number(characteristics.stars) >= minStars);
    const matchesAmenities = amenities.length === 0 ||
      amenities.every(amenity => Boolean(characteristics[amenity.toLowerCase()]));

    return matchesPrice && matchesStars && matchesAmenities;
  });

  const availableProperties = filteredProperties.filter(p => p.available);

  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{
        mb: 6,
        p: 6,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #2196f320 0%, #2196f305 100%)',
        border: '2px solid #2196f330',
        textAlign: 'center'
      }}>
        <Box sx={{ fontSize: '5rem', mb: 3, color: '#2196f3' }}>
          <HotelIcon fontSize="inherit" />
        </Box>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#2196f3', fontWeight: 'bold' }}>
          🏨 Hôtels
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Réservez votre séjour dans nos hôtels partenaires avec des services de qualité
        </Typography>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
          <Chip
            icon={<HotelIcon />}
            label={`${filteredProperties.length} hôtels`}
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
            label={`${new Set(filteredProperties.map(p => p.city)).size} destinations`}
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
            Filtres de recherche - Hôtels
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
              <InputLabel>Catégorie d'hôtel</InputLabel>
              <Select
                value={selectedPropertyType}
                label="Catégorie d'hôtel"
                onChange={(e) => setSelectedPropertyType(e.target.value)}
              >
                <MenuItem value="">
                  <em>Toutes les catégories</em>
                </MenuItem>
                {propertyTypes[ServiceType.HOTEL]?.map(type => (
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
                <MenuItem value="0-50000">0 - 50,000 XOF</MenuItem>
                <MenuItem value="50000-100000">50,000 - 100,000 XOF</MenuItem>
                <MenuItem value="100000-200000">100,000 - 200,000 XOF</MenuItem>
                <MenuItem value="200000-500000">200,000 - 500,000 XOF</MenuItem>
                <MenuItem value="500000-1000000">500,000+ XOF</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Nombre minimum d'étoiles</InputLabel>
              <Select
                value={minStars}
                label="Nombre minimum d'étoiles"
                onChange={(e) => setMinStars(Number(e.target.value))}
              >
                <MenuItem value={0}>Toutes les catégories</MenuItem>
                <MenuItem value={1}>1 étoile minimum</MenuItem>
                <MenuItem value={2}>2 étoiles minimum</MenuItem>
                <MenuItem value={3}>3 étoiles minimum</MenuItem>
                <MenuItem value={4}>4 étoiles minimum</MenuItem>
                <MenuItem value={5}>5 étoiles uniquement</MenuItem>
              </Select>
            </FormControl>

            {/* Amenities Filter */}
            <Box sx={{ gridColumn: 'span 4' }}>
              <Typography variant="subtitle1" gutterBottom>
                Équipements souhaités:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['wifi', 'piscine', 'gym', 'restaurant', 'spa', 'parking', 'room-service', 'bar'].map(amenity => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onClick={() => handleAmenityChange(amenity)}
                    color={amenities.includes(amenity) ? 'primary' : 'default'}
                    variant={amenities.includes(amenity) ? 'filled' : 'outlined'}
                    icon={getAmenityIcon(amenity) as React.ReactElement}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Properties Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon />
          Hôtels ({filteredProperties.length})
        </Typography>

        {availableProperties.length > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              ✨ {availableProperties.length} hôtels disponibles pour réservation immédiate
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 3 }}>
            Chargement des hôtels...
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
                    sx={{ backgroundColor: '#2196f3' }}
                  />
                </Box>
                {/* Stars Rating */}
                <Box sx={{ position: 'absolute', bottom: 12, left: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating
                      value={Number(property.characteristics?.stars) || 0}
                      readOnly
                      size="small"
                      sx={{ color: '#ffc107' }}
                    />
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {property.characteristics?.stars || 'N/A'}
                    </Typography>
                  </Box>
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
                      Services inclus:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.entries(property.characteristics).slice(0, 6).map(([key, value]) => (
                        <Chip
                          key={key}
                          icon={getAmenityIcon(key) as React.ReactElement}
                          label={String(value)}
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
            Aucun hôtel trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aucun hôtel ne correspond à vos critères de recherche.
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
      <Button
        variant="contained"
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, borderRadius: '50%', width: 56, height: 56, minWidth: 56 }}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FilterIcon />
      </Button>
    </Container>
  );
};

export default HotelPage;
