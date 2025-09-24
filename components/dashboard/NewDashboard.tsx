import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types/extended';
import DashboardHome from './DashboardHome';
import AdminPropertyManagement from './admin/AdminPropertyManagement';
import AdminAgentManagement from './admin/AdminAgentManagement';
import AdminSupplierManagement from './admin/AdminSupplierManagement';
import AdminStatistics from './admin/AdminStatisticsFixed';
import AdminReports from './admin/AdminReports';
import AdminSettings from './admin/AdminSettings';
import AgentDashboard from './agent/AgentDashboard';
import GestionUtilisateurs from './user/GestionUtilisateurs';
import GestionFournisseurs from './fournisseur/GestionFournisseurs';
import SupplierDashboard from './supplier/SupplierDashboard';
import UserProfile from './UserProfile';
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
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const NewDashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = 280;

  // Normalisation du rôle backend vers enum frontend
  const normalizedRole: UserRole = (() => {
    switch (currentUser.role.toUpperCase()) {
      case "ADMIN": return UserRole.ADMIN;
      case "AGENT": return UserRole.AGENT;
      case "MANAGER": return UserRole.MANAGER;
      case "SUPPLIER": return UserRole.SUPPLIER;
      default: return UserRole.ADMIN; // Default to ADMIN to show all menu items
    }
  })();

  // Menu items with proper icons and paths
  const menuItems: MenuItem[] = [
    {
      key: 'home',
      label: 'Accueil',
      icon: <HomeIcon />,
      path: '/dashboard/',
      roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER, UserRole.SUPPLIER]
    },
    {
      key: 'profile',
      label: 'Profil',
      icon: <PersonIcon />,
      path: '/dashboard/profile',
      roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER, UserRole.SUPPLIER]
    },
    {
      key: 'users',
      label: 'Gestion des utilisateurs',
      icon: <PeopleIcon />,
      path: '/dashboard/users',
      roles: [UserRole.ADMIN]
    },
    {
      key: 'agents',
      label: 'Gestion des agents',
      icon: <BusinessCenterIcon />,
      path: '/dashboard/agents',
      roles: [UserRole.ADMIN]
    },
    {
      key: 'suppliers',
      label: 'Gestion des fournisseurs',
      icon: <StoreIcon />,
      path: '/dashboard/suppliers',
      roles: [UserRole.ADMIN]
    },
    {
      key: 'reports',
      label: 'Rapports',
      icon: <AssessmentIcon />,
      path: '/dashboard/reports',
      roles: [UserRole.ADMIN]
    },
    {
      key: 'settings',
      label: 'Paramètres',
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
      roles: [UserRole.ADMIN, UserRole.AGENT]
    },
  ];

  // Debug logging
  console.log('Current user role:', currentUser.role);
  console.log('Normalized role:', normalizedRole);
  console.log('Menu items count:', menuItems.filter(item => item.roles.includes(normalizedRole)).length);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

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
        {menuItems
          .filter(item => item.roles.includes(normalizedRole))
          .map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
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
                      fontWeight: location.pathname === item.path ? 'bold' : '500',
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
      </List>
    </div>
  );

  const renderContent = () => {
    if (normalizedRole === UserRole.AGENT || normalizedRole === UserRole.MANAGER) {
      return <AgentDashboard currentUser={currentUser} />;
    }

    if (normalizedRole === UserRole.SUPPLIER) {
      return <SupplierDashboard currentUser={currentUser} />;
    }

    // Admin - Routes complètes
    return (
      <Routes>
        <Route path="/" element={<DashboardHome currentUser={currentUser} />} />
        <Route path="/profile" element={<UserProfile currentUser={currentUser} onUserUpdate={() => {} }/>} />
        <Route path="/users" element={<AdminAgentManagement currentUser={currentUser} />} />
        <Route path="/agents" element={<AgentDashboard currentUser={currentUser} />} />
        <Route path="/suppliers" element={<AdminSupplierManagement currentUser={currentUser} />} />
        <Route path="/properties-admin" element={<AdminPropertyManagement currentUser={currentUser} />} />
        <Route path="/reservations" element={<AdminReports currentUser={currentUser} />} />
        <Route path="/statistics" element={<AdminStatistics currentUser={currentUser} />} />
        <Route path="/reports" element={<AdminReports currentUser={currentUser} />} />
        <Route path="/settings" element={<AdminSettings currentUser={currentUser} />} />
        <Route path="*" element={<Navigate to="/dashboard/" replace />} />
      </Routes>
    );
  };

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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PrestiSéjour - Dashboard Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {currentUser.name}
            </Typography>
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
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
              backgroundColor: 'primary.main',
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
              backgroundColor: 'primary.main',
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
          mt: '64px'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default NewDashboard;
