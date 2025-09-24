import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { User, UserRole } from '../../types/extended';
import api from '../../services/api';

interface UserProfileProps {
  currentUser: User;
  onUserUpdate: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ currentUser, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone1: currentUser.phone1 || '',
    phone2: currentUser.phone2 || '',
    address: currentUser.address || '',
    agency: currentUser.agency || '',
    city: currentUser.city || '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name.trim()) {
        setError('Le nom est obligatoire');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Email valide requis');
        return;
      }

      const updatedUser = await api.updateUser(currentUser.id, formData);
      if (updatedUser) {
        
        onUserUpdate(updatedUser);
        setSuccess('Profil mis à jour avec succès !');
        setIsEditing(false);
      } else {
        setError('Erreur lors de la mise à jour');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur serveur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'Administrateur';
      case UserRole.AGENT: return 'Agent Immobilier';
      case UserRole.MANAGER: return 'Gestionnaire';
      case UserRole.SUPPLIER: return 'Fournisseur';
      default: return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'error';
      case UserRole.AGENT: return 'primary';
      case UserRole.MANAGER: return 'secondary';
      case UserRole.SUPPLIER: return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'white', color: 'primary.main', fontSize: '2rem' }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {currentUser.name}
              </Typography>
              <Chip 
                label={getRoleDisplayName(currentUser.role)} 
                color={getRoleColor(currentUser.role)} 
                variant="filled"
                size="medium"
              />
            </Box>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              color={isEditing ? "error" : "secondary"}
              startIcon={isEditing ? <CancelIcon /> : <PersonIcon />}
              onClick={() => {
                if (isEditing) {
                  setFormData({
                    name: currentUser.name,
                    email: currentUser.email,
                    phone1: currentUser.phone1 || '',
                    phone2: currentUser.phone2 || '',
                    address: currentUser.address || '',
                    agency: currentUser.agency || '',
                    city: currentUser.city || '',
                  });
                  setError('');
                  setSuccess('');
                }
                setIsEditing(!isEditing);
              }}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </Box>

          {/* Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    disabled={!isEditing}
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={!isEditing}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Téléphone 1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleInputChange('phone1')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Téléphone 2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange('phone2')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>

                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                  <TextField
                    fullWidth
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>
              </Box>

              {(currentUser.role === UserRole.AGENT || currentUser.role === UserRole.MANAGER) && (
                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Agence / Hôtel / Résidence"
                    name="agency"
                    value={formData.agency}
                    onChange={handleInputChange('agency')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Box>
              )}
            </Box>

            {isEditing && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    startIcon={<CancelIcon />}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </Box>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
