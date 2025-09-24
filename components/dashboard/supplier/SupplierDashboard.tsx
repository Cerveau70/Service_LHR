import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  CheckCircle as CheckIcon,
  HourglassEmpty as HourglassIcon,
  MonetizationOn as MoneyIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { User, Statistics } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface SupplierDashboardProps {
  currentUser: User;
}

interface Order {
  id: string;
  clientName: string;
  serviceType: string;
  amount: number;
  status: 'En attente' | 'Confirmé' | 'Livré' | 'Annulé';
  orderDate: string;
  deliveryDate?: string;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ currentUser }) => {
  const [statistics, setStatistics] = useState<Partial<Statistics>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const ordersResponse = await extendedApi.getOrdersForSupplier(currentUser.id);
      setOrders(ordersResponse);

      const totalRevenue = ordersResponse.reduce((sum, o) => sum + o.amount, 0);
      const totalReservations = ordersResponse.length;
      setStatistics({ totalRevenue, totalReservations });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const success = await extendedApi.updateOrderStatus(orderId, newStatus);
      if (success) {
        setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
        setSuccess('Statut mis à jour avec succès !');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'En attente': return 'warning';
      case 'Confirmé': return 'info';
      case 'Livré': return 'success';
      case 'Annulé': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2, spaceY: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Tableau de Bord Fournisseur</Typography>
          <Typography variant="body2" color="text.secondary">Bienvenue, {currentUser.name}</Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ textTransform: 'none' }}>+ Nouveau Service</Button>
      </Box>

      {/* Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Stat Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><InventoryIcon /></Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Commandes</Typography>
                <Typography variant="h5" fontWeight="bold">{orders.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}><CheckIcon /></Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Commandes Livrées</Typography>
                <Typography variant="h5" fontWeight="bold">{orders.filter(o => o.status === 'Livré').length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}><HourglassIcon /></Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">En Attente</Typography>
                <Typography variant="h5" fontWeight="bold">{orders.filter(o => o.status === 'En attente').length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}><MoneyIcon /></Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Revenus</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {statistics.totalRevenue?.toLocaleString() || '0'} XOF
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Commandes Récentes</Typography>
          {orders.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Aucune commande reçue pour le moment.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Commande</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}<br/><Typography variant="body2" color="text.secondary">{order.orderDate}</Typography></TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>{order.serviceType}</TableCell>
                      <TableCell>{order.amount.toLocaleString()} XOF</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          size="small"
                        >
                          <MenuItem value="En attente">En attente</MenuItem>
                          <MenuItem value="Confirmé">Confirmé</MenuItem>
                          <MenuItem value="Livré">Livré</MenuItem>
                          <MenuItem value="Annulé">Annulé</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<VisibilityIcon />} sx={{ mr: 1 }}>Détails</Button>
                        {order.status === 'Confirmé' && <Button size="small" color="success">Livrer</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SupplierDashboard;
