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
  Divider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { User, UserRole } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

const GestionFournisseurs: React.FC = () => {
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const fetched = await extendedApi.getUsers();
      setSuppliers(fetched.filter(u => u.role === UserRole.SUPPLIER));
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      try {
        const success = await extendedApi.deleteUser(id);
        if (success) {
          setSuppliers(suppliers.filter(u => u.id !== id));
          setSuccess('Fournisseur supprimé avec succès !');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
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
          <Typography variant="h4" fontWeight="bold">Gestion des Fournisseurs</Typography>
          <Typography variant="body2" color="text.secondary">Liste et gestion de vos fournisseurs</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ textTransform: 'none' }}
        >
          Ajouter un fournisseur
        </Button>
      </Box>

      {/* Messages */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Stat Card */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 33%', lg: '1 1 25%' } }}>
          <Card elevation={3}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Fournisseurs</Typography>
                <Typography variant="h5" fontWeight="bold">{suppliers.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Table des fournisseurs */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Liste des Fournisseurs</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {suppliers.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2 }}>Aucun fournisseur trouvé</Typography>
            ) : (
              suppliers.map(u => (
                <Box key={u.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 50%', lg: '1 1 33%' } }}>
                  <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover': { boxShadow: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>{u.name.charAt(0).toUpperCase()}</Avatar>
                      <Box>
                        <Typography fontWeight="medium">{u.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          <EmailIcon fontSize="small" sx={{ mr: 0.5 }} /> {u.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} /> {u.phone1}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" color="primary" startIcon={<EditIcon />}>Modifier</Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(u.id)}>Supprimer</Button>
                    </Box>
                  </Card>
                </Box>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>Actions Rapides</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 2 }}
              >
                Nouveau Fournisseur
                <Typography variant="body2" color="text.secondary">Ajouter un fournisseur</Typography>
              </Button>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 25%' } }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ListIcon />}
                sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 2 }}
              >
                Liste
                <Typography variant="body2" color="text.secondary">Voir tous les fournisseurs</Typography>
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionFournisseurs;
