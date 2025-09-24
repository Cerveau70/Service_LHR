import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box
} from '@mui/material';
import {
  Home as HomeIcon,
  Hotel as HotelIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          À propos de <span style={{ color: '#1976d2' }}>Service LHR</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="4xl" mx="auto">
          Nous simplifions la réservation et la gestion de logements, hôtels et
          résidences en Côte d'Ivoire grâce à une plateforme moderne, fluide et
          sécurisée.
        </Typography>
      </Box>

      <Grid container spacing={4} mb={8}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <HomeIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Logements modernes
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <HotelIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Hôtels sécurisés
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <BusinessIcon sx={{ fontSize: 48, color: '#e91e63', mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              Résidences confortables
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box maxWidth="4xl" mx="auto" textAlign="center">
        <Typography variant="body1" paragraph>
          Service LHR est votre partenaire de confiance pour vos séjours.
        </Typography>
        <Typography variant="body1" paragraph>
          Nous connectons propriétaires, gestionnaires d'hôtels et voyageurs
          pour créer des expériences fluides et mémorables.
        </Typography>
        <Typography variant="body1" paragraph>
          Avec notre plateforme, trouvez le logement idéal ou gérez vos
          propriétés en toute simplicité.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
