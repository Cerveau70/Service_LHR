import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  Stack,
  Avatar,
  Badge
} from '@mui/material';
import {
  Home as HomeIcon,
  Hotel as HotelIcon,
  Apartment as ApartmentIcon,
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
  Accessible as AccessibleIcon
} from '@mui/icons-material';
import { ServiceType, Property } from '../types/extended';
import { cities, communes, propertyTypes } from '../constants';
import api from '../services/api';
import PropertyCard from './PropertyCard';
import BookingModal from './BookingModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `service-tab-${index}`,
    'aria-controls': `service-tabpanel-${index}`,
  };
}

const ClientView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isBooking, setIsBooking] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const serviceTypes = [
    { type: ServiceType.HOUSING, label: '🏠 Logements', icon: <HomeIcon />, color: '#4caf50' },
    { type: ServiceType.HOTEL, label: '🏨 Hôtels', icon: <HotelIcon />, color: '#2196f3' },
    { type: ServiceType.RESIDENCE, label: '🏢 Résidences', icon: <ApartmentIcon />, color: '#ff9800' }
  ];

  const currentServiceType = serviceTypes[activeTab]?.type;

  useEffect(() => {
    // Reset filters when serviceType changes for better UX
    setSelectedCity('');
    setSelectedCommune('');
    setSelectedPropertyType('');
    setPriceRange([0, 1000000]);
  }, [activeTab]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!currentServiceType) return;

      setLoading(true);
      const filters = {
        serviceType: currentServiceType,
        city: selectedCity,
        commune: selectedCommune,
        propertyType: selectedPropertyType,
      };
      const data = await api.getProperties(filters);
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, [currentServiceType, selectedCity, selectedCommune, selectedPropertyType]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBookingSuccess = (data: any) => {
    // Simulate creating visit reservation
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
    // Simulate sending receipt
    console.log('Receipt sent to client and agent');
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
    };
    return iconMap[amenity.toLowerCase()] || <StarIcon fontSize="small" />;
  };

  const filteredProperties = properties.filter(property => {
    const price = property.price;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  const availableProperties = filteredProperties.filter(p => p.available);
  const unavailableProperties = filteredProperties.filter(p => !p.available);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          PrestiSéjour - Services Immobiliers
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Trouvez le bien idéal selon vos besoins
        </Typography>

        {/* Service Type Tabs */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="service types"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minHeight: 80,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none'
              }
            }}
          >
            {serviceTypes.map((service, index) => (
              <Tab
                key={service.type}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {service.icon}
                    {service.label}
                  </Box>
                }
                {...a11yProps(index)}
                sx={{
                  color: service.color,
                  '&.Mui-selected': {
                    color: service.color,
                    backgroundColor: `${service.color}10`
                  }
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Service Type Content */}
      {serviceTypes.map((service, index) => (
        <TabPanel key={service.type} value={activeTab} index={index}>
          {/* Hero Section for Current Service */}
          <Box sx={{
            mb: 6,
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${service.color}20 0%, ${service.color}05 100%)`,
            border: `2px solid ${service.color}30`,
            textAlign: 'center'
          }}>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>
              {service.icon}
            </Box>
            <Typography variant="h3" component="h2" gutterBottom sx={{ color: service.color, fontWeight: 'bold' }}>
              {service.label}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              {service.type === ServiceType.HOUSING
                ? 'Trouvez le logement idéal pour votre famille avec nos propriétés sélectionnées'
                : service.type === ServiceType.HOTEL
                ? 'Réservez votre séjour dans nos hôtels partenaires avec des services de qualité'
                : 'Découvrez nos résidences modernes avec tous les équipements nécessaires'
              }
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
                Filtres de recherche
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
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
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
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
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
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
                      {propertyTypes[service.type]?.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
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
                </Box>
              </Box>
            )}
          </Paper>

          {/* Properties Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon />
              Propriétés {service.label.toLowerCase()} ({filteredProperties.length})
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
                Chargement des propriétés {service.label.toLowerCase()}...
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
                        sx={{ backgroundColor: service.color }}
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
                          Équipements:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.entries(property.characteristics).slice(0, 4).map(([key, value]) => (
                            <Chip
                              key={key}
                              icon={getAmenityIcon(key)}
                              label={value}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {Object.keys(property.characteristics).length > 4 && (
                            <Chip
                              label={`+${Object.keys(property.characteristics).length - 4}`}
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
                Aucun bien trouvé
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aucun {service.label.toLowerCase()} ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres.
              </Typography>
            </Paper>
          )}
        </TabPanel>
      ))}

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

export default ClientView;
