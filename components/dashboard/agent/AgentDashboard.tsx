import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MonetizationIcon,
  Visibility as VisitIcon,
  BarChart as StatsIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { User, Property, Reservation, VisitReservation, Statistics, ServiceType } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface AgentDashboardProps {
  currentUser: User;
}

interface PropertyFormData {
  name: string;
  serviceType: ServiceType;
  city: string;
  commune: string;
  address: string;
  price: number;
  available: boolean;
  characteristics: Record<string, string | number>;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ currentUser }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [visitReservations, setVisitReservations] = useState<VisitReservation[]>([]);
  const [statistics, setStatistics] = useState<Partial<Statistics>>({});
  const [loading, setLoading] = useState(true);
  const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyFormData, setPropertyFormData] = useState<PropertyFormData>({
    name: '',
    serviceType: ServiceType.HOUSING,
    city: '',
    commune: '',
    address: '',
    price: 0,
    available: true,
    characteristics: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [agentProperties, agentReservations, agentVisitReservations, agentStats] = await Promise.all([
        extendedApi.getAgentProperties(currentUser.id),
        extendedApi.getReservationsForAgent(currentUser.id),
        extendedApi.getVisitReservationsForAgent(currentUser.id),
        extendedApi.getAgentStatistics(currentUser.id),
      ]);
      setProperties(agentProperties);
      setReservations(agentReservations);
      setVisitReservations(agentVisitReservations);
      setStatistics(agentStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPropertyDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setPropertyFormData({
        name: property.name,
        serviceType: property.serviceType,
        city: property.city,
        commune: property.commune,
        address: property.address,
        price: property.price,
        available: property.available,
        characteristics: property.characteristics
      });
    } else {
      setEditingProperty(null);
      setPropertyFormData({
        name: '',
        serviceType: ServiceType.HOUSING,
        city: '',
        commune: '',
        address: '',
        price: 0,
        available: true,
        characteristics: {}
      });
    }
    setOpenPropertyDialog(true);
  };

  const handleClosePropertyDialog = () => {
    setOpenPropertyDialog(false);
    setEditingProperty(null);
  };

  const handleSubmitProperty = async () => {
    try {
      if (editingProperty) {
        const updatedProperty = await extendedApi.updateProperty(editingProperty.id, propertyFormData);
        if (updatedProperty) {
          setProperties(properties.map(p => p.id === editingProperty.id ? updatedProperty : p));
        }
      } else {
        const newProperty = await extendedApi.createProperty({
          ...propertyFormData,
          agentId: currentUser.id
        });
        if (newProperty) {
          setProperties([...properties, newProperty]);
        }
      }
      handleClosePropertyDialog();
      loadDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      try {
        await extendedApi.deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Chargement du tableau de bord...</Typography>
      </Box>
    );
  }

  const availableProperties = properties.filter(p => p.available).length;
  const unavailableProperties = properties.filter(p => !p.available).length;
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">
            Tableau de Bord Agent
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue, {currentUser.name} - Gérez vos propriétés et réservations
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenPropertyDialog()}
          sx={{ px: 3, py: 1.5 }}
        >
          Nouvelle Propriété
        </Button>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
          <Card sx={{ textAlign: 'center', p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }} />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <HomeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">{properties.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Biens</Typography>
            </Box>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
          <Card sx={{ textAlign: 'center', p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&crop=center)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }} />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <CheckIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">{availableProperties}</Typography>
              <Typography variant="body2" color="text.secondary">Disponibles</Typography>
            </Box>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
          <Card sx={{ textAlign: 'center', p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop&crop=center)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }} />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <CalendarIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">{reservations.length}</Typography>
              <Typography variant="body2" color="text.secondary">Réservations</Typography>
            </Box>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
          <Card sx={{ textAlign: 'center', p: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 1
            }} />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <MonetizationIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">{totalRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Revenus (XOF)</Typography>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Réservations et Visites récentes */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 100%', md: '1 1 50%' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Réservations Récentes</Typography>
                <Button size="small" startIcon={<RefreshIcon />} onClick={loadDashboardData}>
                  Actualiser
                </Button>
              </Box>
              {reservations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">Aucune réservation récente</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {reservations.slice(0, 5).map(r => (
                    <Paper key={r.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {r.propertyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {r.clientName} - {r.startDate} au {r.endDate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.totalPrice.toLocaleString()} XOF
                          </Typography>
                        </Box>
                        <Chip
                          label={r.status}
                          color={r.status === 'Confirmé' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 100%', md: '1 1 50%' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Visites Récentes</Typography>
                <Button size="small" startIcon={<RefreshIcon />} onClick={loadDashboardData}>
                  Actualiser
                </Button>
              </Box>
              {visitReservations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <VisitIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">Aucune visite récente</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {visitReservations.slice(0, 5).map(v => (
                    <Paper key={v.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {v.propertyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {v.clientName} - {v.visitDate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {v.visitFee.toLocaleString()} XOF
                          </Typography>
                        </Box>
                        <Chip
                          label={v.status}
                          color={v.status === 'Validé' ? 'success' : v.status === 'Expiré' ? 'error' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Mes Propriétés */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Mes Propriétés</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenPropertyDialog()}
            >
              Nouvelle Propriété
            </Button>
          </Box>

          {properties.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Aucune propriété
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Vous n'avez pas encore ajouté de propriétés
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenPropertyDialog()}
              >
                Ajouter ma première propriété
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Propriété</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Localisation</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prix</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map(property => (
                    <TableRow key={property.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {property.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {property.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {property.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={property.serviceType}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{property.city}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {property.commune}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {property.price.toLocaleString()} XOF
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={property.available ? 'Disponible' : 'Indisponible'}
                          color={property.available ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenPropertyDialog(property)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Actions Rapides
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenPropertyDialog()}
                sx={{ p: 2, justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">Nouvelle Propriété</Typography>
                  <Typography variant="caption" color="text.secondary">Ajouter un bien</Typography>
                </Box>
              </Button>
            </Box>
            <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarIcon />}
                sx={{ p: 2, justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">Réservations</Typography>
                  <Typography variant="caption" color="text.secondary">Gérer les réservations</Typography>
                </Box>
              </Button>
            </Box>
            <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VisitIcon />}
                sx={{ p: 2, justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">Visites</Typography>
                  <Typography variant="caption" color="text.secondary">Gérer les visites</Typography>
                </Box>
              </Button>
            </Box>
            <Box sx={{ flex: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<StatsIcon />}
                sx={{ p: 2, justifyContent: 'flex-start' }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">Statistiques</Typography>
                  <Typography variant="caption" color="text.secondary">Voir mes statistiques</Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier propriété */}
      <Dialog open={openPropertyDialog} onClose={handleClosePropertyDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProperty ? 'Modifier la propriété' : 'Nouvelle propriété'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Nom de la propriété"
                value={propertyFormData.name}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Type de service</InputLabel>
                <Select
                  value={propertyFormData.serviceType}
                  label="Type de service"
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, serviceType: e.target.value as ServiceType }))}
                >
                  <MenuItem value={ServiceType.HOUSING}>Logement</MenuItem>
                  <MenuItem value={ServiceType.HOTEL}>Hôtel</MenuItem>
                  <MenuItem value={ServiceType.RESIDENCE}>Résidence</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Ville"
                value={propertyFormData.city}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Commune"
                value={propertyFormData.commune}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, commune: e.target.value }))}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Adresse complète"
              value={propertyFormData.address}
              onChange={(e) => setPropertyFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                fullWidth
                label="Prix par nuit (XOF)"
                type="number"
                value={propertyFormData.price}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Disponibilité</InputLabel>
                <Select
                  value={propertyFormData.available}
                  label="Disponibilité"
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, available: e.target.value === 'true' }))}
                >
                  <MenuItem value="true">Disponible</MenuItem>
                  <MenuItem value="false">Indisponible</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePropertyDialog}>Annuler</Button>
          <Button onClick={handleSubmitProperty} variant="contained">
            {editingProperty ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bouton flottant pour ajouter une propriété */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenPropertyDialog()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default AgentDashboard;
