import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Home as HomeIcon,
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon,
    Login as LoginIcon,
    House as HouseIcon,
    Hotel as HotelIcon,
    Apartment as ApartmentIcon,
    ContactMail as ContactMailIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { User, ServiceType } from '../types/extended';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const navigationItems = [
        { to: '/', label: 'Accueil', icon: <HomeIcon /> },
        { to: '/logement', label: ServiceType.HOUSING, icon: <HouseIcon /> },
        { to: '/hotel', label: ServiceType.HOTEL, icon: <HotelIcon /> },
        { to: '/residence', label: ServiceType.RESIDENCE, icon: <ApartmentIcon /> },
        { to: '/contact', label: 'Contact', icon: <ContactMailIcon /> },
        { to: '/about', label: 'À propos', icon: <InfoIcon /> }
    ];

    return (
        <AppBar position="sticky" elevation={2}>
            <Toolbar>
                {/* Left Side: Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <HomeIcon sx={{ mr: 1, fontSize: 32 }} />
                        <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                PrestiSéjour
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>
                                Services LHR
                            </Typography>
                        </Box>
                    </Link>
                </Box>

                {/* Center: Main Navigation - Desktop */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
                    {navigationItems.map((item) => (
                        <Button
                            key={item.to}
                            component={NavLink}
                            to={item.to}
                            startIcon={item.icon}
                            sx={{
                                mx: 1,
                                color: 'text.primary',
                                '&.active': {
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                },
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* Right Side: User Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {currentUser ? (
                        <>
                            <Typography variant="body2" sx={{ display: { xs: 'none', lg: 'block' } }}>
                                Bonjour, {currentUser.name}
                            </Typography>
                            <Button
                                component={Link}
                                to="/dashboard"
                                variant="contained"
                                startIcon={<DashboardIcon />}
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                            >
                                Dashboard
                            </Button>
                            <IconButton
                                onClick={handleLogoutClick}
                                color="inherit"
                                title="Déconnexion"
                            >
                                <LogoutIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            startIcon={<LoginIcon />}
                        >
                            Connexion
                        </Button>
                    )}

                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            onClick={handleMobileMenuOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Menu */}
            <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                sx={{ display: { md: 'none' } }}
            >
                {navigationItems.map((item) => (
                    <MenuItem
                        key={item.to}
                        component={NavLink}
                        to={item.to}
                        onClick={handleMobileMenuClose}
                        sx={{
                            '&.active': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                            }
                        }}
                    >
                        {item.icon}
                        <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </AppBar>
    );
};

export default Header;
