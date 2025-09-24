import React, { useEffect, useState } from 'react';
import { User, UserRole, Property, Reservation } from '../../types/extended';
import extendedApi from '../../services/extendedApi'; // Corrected import path
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Added MenuIcon for mobile drawer
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import UserProfile from './UserProfile';
import AgentDashboard from './agent/AgentDashboard';
import GestionUtilisateurs from './user/GestionUtilisateurs';
import GestionFournisseurs from './fournisseur/GestionFournisseurs';
import AdminPropertyManagement from './admin/AdminPropertyManagement';
import AdminReports from './admin/AdminReports';
import AdminSettings from './admin/AdminSettings';
import ManageReservations from './ManageReservations';
// No longer need react-icons if using Material-UI icons
// import { FaTrashAlt, FaEdit } from 'react-icons/fa';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = 280;

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try { // Added try-catch for error handling
        if (currentUser.role === UserRole.ADMIN) {
          const [fetchedProperties, fetchedReservations, fetchedUsers] = await Promise.all([
            extendedApi.getProperties(),
            extendedApi.getAllReservations(),
            extendedApi.getUsers()
          ]);
          setProperties(fetchedProperties);
          setReservations(fetchedReservations);
          setUsers(fetchedUsers);
        } else if ([UserRole.AGENT, UserRole.MANAGER].includes(currentUser.role)) {
          const [agentProps, agentRes] = await Promise.all([
            extendedApi.getAgentProperties(currentUser.id),
            extendedApi.getReservationsForAgent(currentUser.id)
          ]);
          setProperties(agentProps);
          setReservations(agentRes);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally, display an error message to the user
      }
    };
    fetchData();
  }, [currentUser]);

  // Enhanced stats with background images - no blue overlay
  const stats = [
    {
      label: 'Biens Disponibles',
      value: properties.filter(p => p.available).length,
      icon: <CheckCircleIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Biens Indisponibles',
      value: properties.filter(p => !p.available).length,
      icon: <CancelIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Réservations',
      value: reservations.length,
      icon: <CalendarIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Utilisateurs',
      value: users.length,
      icon: <PeopleIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Agents',
      value: users.filter(u => u.role === UserRole.AGENT || u.role === UserRole.MANAGER).length,
      icon: <PersonIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Fournisseurs',
      value: users.filter(u => u.role === UserRole.SUPPLIER).length,
      icon: <BusinessIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Rapports',
      icon: <AssessmentIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center'
    },
    {
      label: 'Paramètres',
      icon: <SettingsIcon />,
      color: '#ffffff',
      bgColor: 'transparent',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center'
    },
  ];

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce bien ?')) {
      try { // Added try-catch
        await extendedApi.deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      try { // Added try-catch
        await extendedApi.deleteReservation(id);
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        console.error("Failed to delete reservation:", error);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try { // Added try-catch
        await extendedApi.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Menu items with proper icons and paths
  const menuItems = [
    { key: 'home', label: 'Accueil', icon: <HomeIcon />, roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER, UserRole.SUPPLIER] },
    { key: 'profile', label: 'Profil', icon: <PersonIcon />, roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER, UserRole.SUPPLIER] },
    { key: 'users', label: 'Gestion des utilisateurs', icon: <PeopleIcon />, roles: [UserRole.ADMIN] },
    { key: 'agents', label: 'Gestion des agents', icon: <PersonIcon />, roles: [UserRole.ADMIN] },
    { key: 'suppliers', label: 'Gestion des fournisseurs', icon: <BusinessIcon />, roles: [UserRole.ADMIN] },
    { key: 'properties', label: 'Mes Biens', icon: <BusinessIcon />, roles: [UserRole.AGENT, UserRole.MANAGER] },
    { key: 'reservations', label: 'Réservations', icon: <CalendarIcon />, roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER] },
    { key: 'reports', label: 'Rapports', icon: <AssessmentIcon />, roles: [UserRole.ADMIN] },
    { key: 'settings', label: 'Paramètres', icon: <SettingsIcon />, roles: [UserRole.ADMIN, UserRole.AGENT] },
  ];

  // Normalize role for comparison
  const normalizeRole = (role: string): UserRole => {
    const normalized = role.toLowerCase().trim();
    switch (normalized) {
      case 'administrateur':
      case 'admin':
        return UserRole.ADMIN;
      case 'agent immobilier':
      case 'agent':
        return UserRole.AGENT;
      case 'gestionnaire':
      case 'manager':
        return UserRole.MANAGER;
      case 'fournisseur':
      case 'supplier':
        return UserRole.SUPPLIER;
      default:
        console.warn('Unknown role:', role, 'defaulting to ADMIN');
        return UserRole.ADMIN; // Default to admin to show all menu items
    }
  };

  const normalizedUserRole = normalizeRole(currentUser.role);

  // Fallback: if no menu items match the role, show all items (for debugging)
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(normalizedUserRole));
  const menuItemsToShow = filteredMenuItems.length > 0 ? filteredMenuItems : menuItems;

  // Debug logging
  console.log('Current user:', currentUser);
  console.log('Current user role:', currentUser.role);
  console.log('Available roles:', Object.values(UserRole));
  console.log('Normalized user role:', normalizedUserRole);
  console.log('Menu items count:', menuItemsToShow.length);
  console.log('Filtered menu items:', menuItemsToShow);

  const drawer = (
    <div style={{ backgroundColor: '#1976d2', minHeight: '100vh' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
            <DashboardIcon />
          </Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
            PrestiSéjour
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        {menuItemsToShow
          .map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={activeTab === item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  color: 'white',
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  minHeight: '48px',
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      fontWeight: activeTab === item.key ? 'bold' : '500',
                      color: 'white',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '16px 0' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              color: 'white',
              borderRadius: 1,
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </ListItem>
      </List> //cedricforreal
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Dashboard Header */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon /> {/* Corrected to MenuIcon for mobile drawer toggle */}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PrestiSéjour - Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {currentUser.name}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
            >
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1976d2',
              color: 'white'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1976d2',
              color: 'white'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px' // AppBar height is typically 64px
        }}
      >
        <Container maxWidth="xl">
        {activeTab === 'home' && (
          <Box> {/* Changed div to Box for consistency */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}> {/* Corrected h1 styling */}
              Dashboard
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 6 }}>
              {stats.map((s, idx) => (
                <Card key={idx} sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: s.bgColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '180px',
                  backgroundImage: `url(${s.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1
                  },
                  '& > *': {
                    position: 'relative',
                    zIndex: 2
                  }
                }}>
                  <Box>
                    <Typography variant="h6" component="h3" sx={{
                      fontWeight: 'bold',
                      textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)',
                      color: '#ffffff',
                      fontSize: '1.1rem'
                    }}>{s.label}</Typography>
                    <Typography variant="h3" component="p" sx={{
                      fontWeight: 'bold',
                      textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)',
                      color: '#ffffff',
                      fontSize: '2.5rem',
                      marginTop: '8px'
                    }}>{s.value}</Typography>
                  </Box>
                  <Box sx={{
                    fontSize: '3rem',
                    opacity: 0.95,
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))',
                    color: '#ffffff'
                  }}>{s.icon}</Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}
        {activeTab === 'profile' && (
          <UserProfile currentUser={currentUser} onUserUpdate={() => {}} />
        )}

        {activeTab === 'users' && (
          <GestionUtilisateurs />
        )}

        {activeTab === 'agents'  && (
          <AgentDashboard currentUser={currentUser} />
        )}

        {activeTab === 'suppliers'  && (
          <AgentDashboard currentUser={currentUser} />
        )}

        {activeTab === 'properties'  && (
          <AdminPropertyManagement currentUser={currentUser} />
        )}

        {activeTab === 'reservations'  && (
          <ManageReservations currentUser={currentUser} />
        )}

        {activeTab === 'reports' && (
          <AdminReports currentUser={currentUser} />
        )}

        {activeTab === 'settings'  && (
          <AdminSettings currentUser={currentUser} />
        )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;