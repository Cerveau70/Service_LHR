import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import HousingPage from './components/pages/HousingPage';
import HotelPage from './components/pages/HotelPage';
import ResidencePage from './components/pages/ResidencePage';
import HomePage from './components/pages/HomePage';
import Login from './components/Login';
import Contact from './components/Contact';
import About from './components/About';
import Dashboard from './components/dashboard/Dashboard';
import { User, ServiceType } from './types/extended';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue primary
    },
    secondary: {
      main: '#ffffff', // White secondary
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

// Composant pour gérer le layout conditionnel
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <main style={{
      flexGrow: 1,
      padding: isHomePage ? '0' : '2rem',
      backgroundColor: isHomePage ? 'transparent' : undefined
    }}>
      {children}
    </main>
  );
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // pour éviter le rendu avant lecture localStorage

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false); // lecture terminée
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
                    <Header currentUser={currentUser} onLogout={handleLogout} />

                    <LayoutWrapper>
                        <Routes>
                            {/* Page d'accueil par défaut */}
                            <Route path="/" element={<HomePage />} />

                            {/* Pages clients */}
                            <Route path="/logement" element={<HousingPage />} />
                            <Route path="/hotel" element={<HotelPage />} />
                            <Route path="/residence" element={<ResidencePage />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />

                            {/* Authentification */}
                            <Route
                                path="/login"
                                element={currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
                            />

                            {/* Dashboard direct - without header and footer */}
                            <Route
                                path="/dashboard"
                                element={currentUser ? <Dashboard currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                            />
                        </Routes>
                    </LayoutWrapper>
                </div>
            </HashRouter>
        </ThemeProvider>
    );
};

export default App;
