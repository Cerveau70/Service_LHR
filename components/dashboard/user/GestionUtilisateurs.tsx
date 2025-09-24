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
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Tooltip,
  InputAdornment,
  Fab
} from '@mui/material';
import {
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { User, UserRole, UserStatus } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone1?: string;
  phone2?: string;
  address?: string;
  city?: string;
  agency?: string;
}

const GestionUtilisateurs: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    phone1: '',
    phone2: '',
    address: '',
    city: '',
    agency: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetched = await extendedApi.getUsers();
      setUsers(fetched);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const successDelete = await extendedApi.deleteUser(id);
        if (successDelete) {
          setUsers(users.filter(u => u.id !== id));
          setSuccess('Utilisateur supprimé avec succès');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone1: user.phone1 || '',
        phone2: user.phone2 || '',
        address: user.address || '',
        city: user.city || '',
        agency: user.agency || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        phone1: '',
        phone2: '',
        address: '',
        city: '',
        agency: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await extendedApi.updateUser(editingUser.id, formData);
        if (updatedUser) {
          setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
          setSuccess('Utilisateur mis à jour avec succès');
        }
      } else {
        // Create new user
        const newUser = await extendedApi.createUser(formData);
        if (newUser) {
          setUsers([...users, newUser]);
          setSuccess('Utilisateur créé avec succès');
        }
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filters.role || u.role === filters.role;
    const matchesStatus = !filters.status || u.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'error';
      case UserRole.AGENT: return 'primary';
      case UserRole.MANAGER: return 'secondary';
      case UserRole.SUPPLIER: return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'success';
      case UserStatus.INACTIVE: return 'warning';
      case UserStatus.SUSPENDED: return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Chargement des utilisateurs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">
            Gestion des Utilisateurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez tous les utilisateurs de la plateforme
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ px: 3, py: 1.5 }}
        >
          Nouvel Utilisateur
        </Button>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card sx={{ flex: '1 1 250px', textAlign: 'center', p: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <PeopleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">{users.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Utilisateurs</Typography>
        </Card>
        <Card sx={{ flex: '1 1 250px', textAlign: 'center', p: 3 }}>
          <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <PeopleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {users.filter(u => u.status === UserStatus.ACTIVE).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Actifs</Typography>
        </Card>
        <Card sx={{ flex: '1 1 250px', textAlign: 'center', p: 3 }}>
          <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <PeopleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {users.filter(u => u.role === UserRole.AGENT).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Agents</Typography>
        </Card>
        <Card sx={{ flex: '1 1 250px', textAlign: 'center', p: 3 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <PeopleIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {users.filter(u => u.role === UserRole.ADMIN).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Administrateurs</Typography>
        </Card>
      </Box>

      {/* Barre de recherche et filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <TextField
                fullWidth
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={filters.role}
                  label="Rôle"
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                >
                  <MenuItem value="">Tous les rôles</MenuItem>
                  <MenuItem value={UserRole.ADMIN}>Administrateur</MenuItem>
                  <MenuItem value={UserRole.AGENT}>Agent</MenuItem>
                  <MenuItem value={UserRole.MANAGER}>Gestionnaire</MenuItem>
                  <MenuItem value={UserRole.SUPPLIER}>Fournisseur</MenuItem>
                  <MenuItem value={UserRole.CLIENT}>Client</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={filters.status}
                  label="Statut"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">Tous les statuts</MenuItem>
                  <MenuItem value={UserStatus.ACTIVE}>Actif</MenuItem>
                  <MenuItem value={UserStatus.INACTIVE}>Inactif</MenuItem>
                  <MenuItem value={UserStatus.SUSPENDED}>Suspendu</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '0 0 auto' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadUsers}
              >
                Actualiser
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucun utilisateur trouvé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filters.role || filters.status
                  ? 'Aucun utilisateur ne correspond aux critères de recherche'
                  : 'Aucun utilisateur enregistré'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Utilisateur</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rôle</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Localisation</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                          {user.phone1 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">{user.phone1}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {user.city && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationIcon fontSize="small" color="action" />
                              <Typography variant="body2">{user.city}</Typography>
                            </Box>
                          )}
                          {user.agency && (
                            <Typography variant="caption" color="text.secondary">
                              Agence: {user.agency}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(user.id)}
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

      {/* Dialog pour ajouter/modifier utilisateur */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                fullWidth
                label="Nom complet"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <FormControl fullWidth required>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={formData.role}
                  label="Rôle"
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                >
                  <MenuItem value={UserRole.CLIENT}>Client</MenuItem>
                  <MenuItem value={UserRole.AGENT}>Agent</MenuItem>
                  <MenuItem value={UserRole.MANAGER}>Gestionnaire</MenuItem>
                  <MenuItem value={UserRole.ADMIN}>Administrateur</MenuItem>
                  <MenuItem value={UserRole.SUPPLIER}>Fournisseur</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <FormControl fullWidth required>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  label="Statut"
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                >
                  <MenuItem value={UserStatus.ACTIVE}>Actif</MenuItem>
                  <MenuItem value={UserStatus.INACTIVE}>Inactif</MenuItem>
                  <MenuItem value={UserStatus.SUSPENDED}>Suspendu</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Téléphone 1"
                value={formData.phone1}
                onChange={(e) => setFormData(prev => ({ ...prev, phone1: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Téléphone 2"
                value={formData.phone2}
                onChange={(e) => setFormData(prev => ({ ...prev, phone2: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Ville"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Agence"
                value={formData.agency}
                onChange={(e) => setFormData(prev => ({ ...prev, agency: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bouton flottant pour ajouter un utilisateur */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <PersonAddIcon />
      </Fab>
    </Box>
  );
};

export default GestionUtilisateurs;